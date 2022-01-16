#!/usr/bin/env node

const { WASI } = require('./vendor/wasi')
// const { WASI } = require('@wasmer/wasi')
const wasiNodeBindings = require('@wasmer/wasi/lib/bindings/node')['default']
const fs = require('fs')
const path = require('path')

async function main() {
    const args = process.argv
        .slice(2)
        .map((k) => (k.startsWith('-') ? k : path.relative(process.cwd(), k)))
    if (args.length === 0) args.push('--help')
    const wasi = new WASI({
        args: ['circom2', ...args],
        env: process.env,
        preopens: preopensFull(),
        bindings: wasiNodeBindings,
    })
    const wasm_bytes = fs.readFileSync(require.resolve('./circom.wasm'))
    // const lowered_wasm = await lowerI64Imports(wasm_bytes)
    const mod = await WebAssembly.compile(wasm_bytes)
    const instance = await WebAssembly.instantiate(mod, {
        ...wasi.getImports(mod),
    })
    if (args.includes('--version')) {
        console.log('circom2 npm package', require('./package.json').version)
    }
    wasi.start(instance)
}

// Enumerate all possible relative parent paths for the preopens.
function preopensFull() {
    const preopens = {}
    let cwd = process.cwd()
    while (1) {
        const seg = path.relative(process.cwd(), cwd) || '.'
        preopens[seg] = seg
        const next = path.dirname(cwd)
        if (next === cwd) break
        cwd = next
    }
    return preopens
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
