# Circom 2.0 WASM

This is a proof of concept of Circom 2.0 compiled to WASM.

# Getting Started

```
# Compiling to WASM
npm install -g rustwasmc
cd circom
rustwasmc build --dev # fast compile, slow to run
rustwasmc build --enable-aot # slow but optimized build


# Testing out the compiled version
mkdir -p output
~/.wasmedge/bin/wasmedge --dir .:. pkg/circom.wasm --output output basic.circom --wat
wat2wasm output/basic_js/basic.wat -o output/basic_js/basic.wasm
cd output/basic_js
node generate_witness.js basic.wasm input.json out.wtns


# Creating NPM Package
cp pkg/circom.wasm ../npm
```

Note that this does not support
