const { WASI } = require('@wasmer/wasi')
const wasiBindings = require('@wasmer/wasi/lib/bindings/node')['default']
const fs = require('fs')
const path = require('path')

async function main() {
    let wasi = new WASI({
        args: ['circom2', ...process.argv.slice(2)],
        env: process.env,
        preopens: preopensFull(),
        bindings: {
            ...wasiBindings,
        },
    })
    const wasm_bytes = fs.readFileSync(require.resolve('./circom.wasm'))
    // const lowered_wasm = await lowerI64Imports(wasm_bytes)
    let module = await WebAssembly.compile(wasm_bytes)
    let instance = await WebAssembly.instantiate(module, {
        ...wasi.getImports(module),
    })
    wasi.start(instance)
}

// Enumerate all possible relative parent paths for the preopens.
function preopensFull() {
    const preopens = {}
    let cwd = process.cwd()
    while (1) {
        let seg = path.relative(process.cwd(), cwd) || '.'
        preopens[seg] = seg
        let next = path.dirname(cwd)
        if (next === cwd) break
        cwd = next
    }
    return preopens
}

main()
