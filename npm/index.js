const isTypedArray = require('is-typed-array')

const { WASI } = require('./vendor/wasi')
const defaultBindings = require('./bindings')

const defaultPreopens = {
    '.': '.',
}

class CircomRunner {
    constructor({ args, env, preopens = defaultPreopens, bindings = defaultBindings } = {}) {
        this.wasi = new WASI({
            args: ['circom2', ...args],
            env,
            preopens,
            bindings,
        })
    }

    async compile(bufOrResponse) {
        // TODO: Handle ArrayBuffer
        if (isTypedArray(bufOrResponse)) {
            return WebAssembly.compile(bufOrResponse)
        }

        // Require Response object if not a TypedArray
        const response = await bufOrResponse
        if (!(response instanceof Response)) {
            throw new Error('Expected TypedArray or Response object')
        }

        const contentType = response.headers.get('Content-Type') || ''

        if ('instantiateStreaming' in WebAssembly && contentType.startsWith('application/wasm')) {
            return WebAssembly.compileStreaming(response)
        }

        const buffer = await response.arrayBuffer()
        return WebAssembly.compile(buffer)
    }

    async execute(bufOrResponse) {
        const mod = await this.compile(bufOrResponse)
        const instance = await WebAssembly.instantiate(mod, {
            ...this.wasi.getImports(mod),
        })

        this.wasi.start(instance)

        // Return the instance in case someone wants to access exports or something
        return instance
    }
}

module.exports = CircomRunner
