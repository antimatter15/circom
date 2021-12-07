# Circom 2.0 WASM

This is a proof of concept of Circom 2.0 compiled to WASM.

# Getting Started

```
cd circom

# Compiling to WASM with rustwasmc/wasmedge
npm install -g rustwasmc
rustwasmc build --dev # fast compile, slow to run
rustwasmc build --enable-aot # slow but optimized build

# Alternative: Compiling to WASM with cargo-wasi
cargo wasi build
# Note that for me, --release doesn't work
# However the binaries at ../target

# Testing out the compiled version with wasmedge
mkdir -p output
~/.wasmedge/bin/wasmedge --dir .:. pkg/circom.wasm --output output basic.circom --wat
wat2wasm output/basic_js/basic.wat -o output/basic_js/basic.wasm
cd output/basic_js
node generate_witness.js basic.wasm input.json out.wtns

# Testing out the compiled version with wasmtime
wasmtime --dir . pkg/circom.wasm --output output basic.circom --wat
wat2wasm output/basic_js/basic.wat -o output/basic_js/basic.wasm
cd output/basic_js
node generate_witness.js basic.wasm input.json out.wtns

# Copying
cp pkg/circom.wasm ../npm
```
