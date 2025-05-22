const path = require('path-browserify')
const fs = require('fs')

const circomLib = require('../pkg/circom_lib.js')

class CircomRunner {
    constructor({ args, env, preopens = {}, bindings = {} } = {}) {
        this.args = args || []
        this.env = env || {}
        this.preopens = preopens || {}
        this.bindings = bindings || {}
    }

    async execute(wasmBytes) {
        try {
            const circuitPath = this.args[0] || ''
            const outputPath = this.args.indexOf('-o') > -1 ? 
                this.args[this.args.indexOf('-o') + 1] : ''
            
            const flags = this.args
                .filter(arg => arg !== circuitPath && arg !== '-o' && arg !== outputPath)
                .join(' ')
            
            const result = circomLib.compile(circuitPath, outputPath, flags)
            
            // Return a mock instance to maintain compatibility with the old API
            return {
                exports: {
                    memory: { buffer: new ArrayBuffer(0) }
                }
            }
        } catch (err) {
            throw err
        }
    }
}

module.exports.CircomRunner = CircomRunner
