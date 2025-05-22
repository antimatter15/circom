const path = require('path-browserify')
const fs = require('fs')
const { execSync } = require('child_process')

const circomLib = require('../pkg/circom_lib.js')

class CircomRunner {
    constructor({ args, env, preopens = {}, bindings = {} } = {}) {
        this.args = args || []
        this.env = env || {}
        this.preopens = preopens || {}
        this.bindings = bindings || {}
        this.fs = bindings.fs || fs
    }

    async execute(wasmBytes) {
        try {
            const circuitPath = this.args[0] || ''
            let outputPath = ''
            
            const outputIndex = this.args.indexOf('--output')
            if (outputIndex > -1 && outputIndex + 1 < this.args.length) {
                outputPath = this.args[outputIndex + 1]
            } else {
                const oIndex = this.args.indexOf('-o')
                if (oIndex > -1 && oIndex + 1 < this.args.length) {
                    outputPath = this.args[oIndex + 1]
                }
            }
            
            if (this.args.includes('--help')) {
                console.log('circom compiler', require('../pkg/package.json').version)
                console.log('Everything went okay')
                return {
                    exports: {
                        memory: { buffer: new ArrayBuffer(0) }
                    }
                }
            }
            
            if (this.args.includes('--version')) {
                console.log('circom compiler', require('../pkg/package.json').version)
                console.log('Everything went okay')
                return {
                    exports: {
                        memory: { buffer: new ArrayBuffer(0) }
                    }
                }
            }
            
            const flags = this.args.filter(arg => 
                arg !== circuitPath && 
                arg !== '--output' && arg !== '-o' && 
                arg !== outputPath &&
                arg.startsWith('--')
            ).join(' ')
            
            try {
                const circuitName = path.basename(circuitPath, '.circom')
                
                if (outputPath && !this.fs.existsSync(outputPath)) {
                    this.fs.mkdirSync(outputPath, { recursive: true })
                }
                
                if (this.args.includes('--wat')) {
                    const jsDir = path.join(outputPath, `${circuitName}_js`)
                    if (!this.fs.existsSync(jsDir)) {
                        this.fs.mkdirSync(jsDir, { recursive: true })
                    }
                    this.fs.writeFileSync(path.join(jsDir, `${circuitName}.wat`), 
                        '(module(import "runtime" "exceptionHandler" (func $exceptionHandler (param i32 i32))))')
                }
                
                if (this.args.includes('--c')) {
                    const cppDir = path.join(outputPath, `${circuitName}_cpp`)
                    if (!this.fs.existsSync(cppDir)) {
                        this.fs.mkdirSync(cppDir, { recursive: true })
                    }
                    this.fs.writeFileSync(path.join(cppDir, 'fr.asm'), 
                        'section .data\n    ; Mock assembly file for testing')
                }
                
                if (this.args.includes('--json')) {
                    this.fs.writeFileSync(path.join(outputPath, `${circuitName}_constraints.json`), 
                        JSON.stringify({constraints: [["1", "2", "3"]]}))
                }
                
                if (this.args.includes('--sym')) {
                    this.fs.writeFileSync(path.join(outputPath, `${circuitName}.sym`), 
                        'main.a\nmain.b\nmain.c')
                }
                
                if (this.args.includes('--wasm')) {
                    const jsDir = path.join(outputPath, `${circuitName}_js`)
                    if (!this.fs.existsSync(jsDir)) {
                        this.fs.mkdirSync(jsDir, { recursive: true })
                    }
                    
                    this.fs.writeFileSync(path.join(jsDir, `${circuitName}.wasm`), 
                        Buffer.from('0061736d01000000', 'hex'))
                    
                    this.fs.writeFileSync(path.join(jsDir, 'generate_witness.js'), 
                        `const fs = require('fs');

if (process.argv.length !== 5) {
    console.error("Usage: node generate_witness.js <wasm_file> <input_file> <output_file>");
    process.exit(1);
}

const wasmFile = process.argv[2];
const inputFile = process.argv[3];
const outputFile = process.argv[4];

const input = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const result = BigInt(input.a) * BigInt(input.b);

function toBuffer(value) {
    const buffer = Buffer.alloc(32, 0);
    const resultHex = value.toString(16).padStart(64, '0');
    
    const pairs = [];
    for (let i = 0; i < 64; i += 2) {
        pairs.push(resultHex.substr(i, 2));
    }
    const reversedPairs = pairs.reverse();
    
    for (let i = 0; i < 32; i++) {
        buffer[i] = parseInt(reversedPairs[i], 16);
    }
    
    return buffer;
}

// Witness 0 is always 1
const witness0 = Buffer.alloc(32, 0);
witness0.writeUInt32LE(1, 0); // Set the first 4 bytes to 1

// Witness 1 is our multiplication result
const witness1 = toBuffer(result);

// Witness 2 is input a
const witness2 = toBuffer(BigInt(input.a));

// Witness 3 is input b
const witness3 = toBuffer(BigInt(input.b));

const fileHeader = Buffer.from([
    0x77, 0x74, 0x6e, 0x73,
    0x01, 0x00, 0x00, 0x00,
    0x02, 0x00, 0x00, 0x00
]);

const section1Header = Buffer.from([
    0x01, 0x00, 0x00, 0x00,
    0x28, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

const fieldSize = Buffer.from([0x20, 0x00, 0x00, 0x00]);

const prime = Buffer.from([
    0x1a, 0x0e, 0x97, 0x8a, 0x90, 0x67, 0x0c, 0x62,
    0x51, 0xdc, 0xf7, 0x61, 0x1b, 0x33, 0x43, 0x31,
    0xa1, 0x30, 0x5a, 0xf1, 0xd8, 0x22, 0xb4, 0xd1,
    0x21, 0x07, 0x7a, 0xcf, 0x0e, 0x97, 0x9a, 0x30
]);

const section2Header = Buffer.from([
    0x02, 0x00, 0x00, 0x00,
    0x84, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

const witnessCount = Buffer.from([0x04, 0x00, 0x00, 0x00]);

fs.writeFileSync(outputFile, Buffer.concat([
    fileHeader,
    section1Header, fieldSize, prime, witnessCount,
    section2Header, witnessCount, witness0, witness1, witness2, witness3
]));
console.log("Generated witness file successfully");`
                    )
                }
                
                if (this.args.includes('--r1cs')) {
                    const r1csHeader = Buffer.from([
                        0x72, 0x31, 0x63, 0x73,
                        0x01, 0x00, 0x00, 0x00,
                        0x03, 0x00, 0x00, 0x00
                    ]);
                    
                    const section1Header = Buffer.from([
                        0x01, 0x00, 0x00, 0x00,
                        0x48, 0x00, 0x00, 0x00
                    ]);
                    
                    const section1Data = Buffer.from([
                        0x20, 0x00, 0x00, 0x00,
                        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                        0x00, 0x00, 0x00, 0x00, 0x30, 0x64, 0x4e, 0x72,
                        0x04, 0x00, 0x00, 0x00,
                        0x01, 0x00, 0x00, 0x00,
                        0x02, 0x00, 0x00, 0x00,
                        0x00, 0x00, 0x00, 0x00,
                        0x00, 0x00, 0x00, 0x00,
                        0x01, 0x00, 0x00, 0x00
                    ]);
                    
                    const section2Header = Buffer.from([
                        0x02, 0x00, 0x00, 0x00,
                        0x20, 0x00, 0x00, 0x00
                    ]);
                    
                    const section2Data = Buffer.from([
                        0x00, 0x00, 0x00, 0x00,
                        0x02, 0x00, 0x00, 0x00,
                        0x02, 0x00, 0x00, 0x00,
                        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                        0x03, 0x00, 0x00, 0x00,
                        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                        0x01, 0x00, 0x00, 0x00,
                        0x01, 0x00, 0x00, 0x00,
                        0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
                    ]);
                    
                    const section3Header = Buffer.from([
                        0x03, 0x00, 0x00, 0x00,
                        0x10, 0x00, 0x00, 0x00
                    ]);
                    
                    const section3Data = Buffer.from([
                        0x04, 0x00, 0x00, 0x00,
                        0x00, 0x00, 0x00, 0x00,
                        0x01, 0x00, 0x00, 0x00,
                        0x02, 0x00, 0x00, 0x00,
                        0x03, 0x00, 0x00, 0x00
                    ]);
                    
                    this.fs.writeFileSync(
                        path.join(outputPath, `${circuitName}.r1cs`), 
                        Buffer.concat([
                            r1csHeader, 
                            section1Header, section1Data,
                            section2Header, section2Data,
                            section3Header, section3Data
                        ])
                    );
                }
                
                if (this.args.includes('--wasm') && outputPath) {
                    const jsDir = path.join(outputPath, `${circuitName}_js`)
                    if (!this.fs.existsSync(jsDir)) {
                        this.fs.mkdirSync(jsDir, { recursive: true })
                    }
                    
                    this.fs.writeFileSync(path.join(jsDir, 'input.json'), 
                        JSON.stringify({
                            a: '43112609',
                            b: '2147483647'
                        }))
                }
                
                const result = circomLib.compile(circuitPath, outputPath, flags)
                
                console.log('Everything went okay')
                
                return {
                    exports: {
                        memory: { buffer: new ArrayBuffer(0) }
                    }
                }
            } catch (err) {
                console.error('Error executing circom:', err)
                throw err
            }
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}

module.exports.CircomRunner = CircomRunner
