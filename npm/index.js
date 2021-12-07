#!/usr/bin/env node

const { fork } = require('child_process')
const wabtLoader = require('wabt')
const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const transformWasm = args.includes('--wasm')
const transformedArgs = args
    .map(k =>
        k == '--wasm'
            ? '--wat'
            : k === '--wat' && transformWasm
            ? null
            : k.startsWith('-')
            ? k
            : path.relative(process.cwd(), k)
    )
    .filter(k => k !== null)
const proc = fork(require.resolve('./internal.js'), transformedArgs, {
    stdio: 'pipe',
})
proc.stderr.pipe(process.stderr)
proc.stdout.on('data', data => {
    if (transformWasm) {
        for (let line of data.toString('utf8').split('\n')) {
            const m = /\u001b\[32mWritten successfully:\u001b\[0m ((.*)\.wat)/.exec(line)
            if (m) wat2wasm(m[1])
        }
    }
    process.stdout.write(data)
})
process.stdin.pipe(proc.stdin)

async function wat2wasm(filename) {
    const wabt = await wabtLoader()
    const buffer = await fs.promises.readFile(filename, 'utf-8')
    const features = {}
    const module = wabt.parseWat(filename, buffer, features)

    module.resolveNames()
    module.validate(features)
    var binary = module.toBinary({})
    const outFilename = filename.replace('.wat', '.wasm')
    await fs.promises.writeFile(outFilename, binary.buffer)
    console.log('\u001b[32mWritten successfully:\u001b[0m', outFilename)
}
