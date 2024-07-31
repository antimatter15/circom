# Circom 2.0

[![Website][ico-website]][link-website]
[![Telegram][ico-telegram]][link-telegram]

Circom aims to provide developers a holistic framework to construct arithmetic circuits through an easy-to-use interface and abstracting the complexity of the proving mechanisms. This version includes support for WebAssembly (WASM) compilation.

# Getting Started

For standard Circom usage, refer to the [Getting started section](https://docs.circom.io/getting-started/installation/) in the documentation.

For WASM compilation:

```bash
cd circom

# Compiling to WASM with rustwasmc/wasmedge
npm install -g rustwasmc
rustwasmc build --dev # fast compile, slow to run
rustwasmc build --enable-aot # slow but optimized build

# Testing out the compiled version with wasmedge
mkdir -p output
~/.wasmedge/bin/wasmedge --dir .:. pkg/circom.wasm --output output basic.circom --wasm
cd output/basic_js
node generate_witness.js basic.wasm input.json out.wtns

# Testing out the compiled version with wasmtime
wasmtime --dir . pkg/circom.wasm --output output basic.circom --wasm
cd output/basic_js
node generate_witness.js basic.wasm input.json out.wtns

# Copying
cp pkg/circom.wasm ../npm
```

# Documentation

All documentation is available in [circom 2 Documentation](https://docs.circom.io/). We encourage you to read it. If you are new, start with the [Getting started section](https://docs.circom.io/getting-started/installation/).

Basic background on Zero-knowledge proofs can be found in the [Background section](https://docs.circom.io/background/background/).

Circom language reference can be found at [circom language reference](https://docs.circom.io/circom-language/signals).

# Installation

Refer to the [Installation section](https://docs.circom.io/getting-started/installation/) in the documentation.

## Syntax Highlighting

Two syntax highlighters are available:
- [circom Visual Studio Code highlight syntax](https://github.com/iden3/circom-highlighting-vscode)
- [circom Vim highlight syntax](https://github.com/iden3/vim-circom-syntax)

## :warning: Deprecation note

The previous `circom 1` compiler written in Javascript is deprecated, but the [circom 1 repository](https://github.com/iden3/circom_old) is still available.

# Community

Thank you for considering contributing to the circom & snarkjs framework!

As the `circom` and `snarkjs` community grows, new tools, circuits, and projects have appeared. Here we link some of them:

## Circuits

+ [0xPARC circom ECDSA circuit](https://github.com/0xPARC/circom-ecdsa)

## Tools

+ [zkREPL: an online playground for zk circuits](https://zkrepl.dev)
+ [Shield: a development framework for circom developers](https://xord.notion.site/SHIELD-5306223ca4f745d19f54b9a5f4004cd6)
+ [Circomspect: a static analyzer for detecting common vulnerabilities in circom circuits that extends the checks performed by the circom flag --inspect](https://github.com/trailofbits/circomspect)
+ [CIVER: a static analyzer for specifying and verifying circom circuits (including weak-safety checks)](https://github.com/costa-group/circom_civer)
+ [Ecne: a static analyzer verifying weak and strong safety for circom circuits](https://github.com/franklynwang/EcneProject)
+ [PICUS: a static analyzer for verifying weak and strong safety for circom circuits](https://github.com/Veridise/Picus)

More information about the notions of weak and strong safety in circom circuits [here](https://ieeexplore.ieee.org/document/10002421).

[ico-website]: https://img.shields.io/website?up_color=blue&up_message=circom&url=https%3A%2F%2Fiden3.io%2Fcircom
[ico-telegram]: https://img.shields.io/badge/@iden3-2CA5E0.svg?style=flat-square&logo=telegram&label=Telegram

[link-website]: https://iden3.io/circom
[link-telegram]: https://t.me/iden3io
