# Circom 2.0 WASM

This project is a version of Circom 2.0 compiled to WASM.

This is only an experiment and has not been adequately tested!

## Changelog

-   0.2.19 - Pulling from upstream circom (2.1.9)
-   0.2.16 - Pulling from upstream circom (2.1.6 / ccc8cd7)
-   0.2.13 - Pulling from upstream circom (2.1.4 / 18529d0)
-   0.2.12 - Pulling from upstream circom (2.1.3 / 1dadb4)
-   0.2.11 - Pulling from upstream circom (2.1.2 / d35e4fd)
-   0.2.10 - Pulling from upstream circom (2.1.0 / ec6388c)
-   0.2.9 - Fix regression in 0.2.7 (https://github.com/antimatter15/circom/pull/12)
-   0.2.8 - Reverting upstream circom (2.0.8 / 8d6830a)
-   0.2.7 - Pulling from upstream circom (2.0.8 / c7971d7)
-   0.2.6 - Pulling from upstream circom (2.0.8)
-   0.2.5 - Syntax for adding labels to logs
-   0.2.4 - Pulling from upstream circom (2.0.6)
-   0.2.3 - Pulling from upstream circom (2.0.5)
-   0.2.2 - Pulling from upstream circom (2.0.4) and fixing path normalization
-   0.2.1 - Pulling from upstream circom
-   0.2.0 - Adding programmatic API (By @phated)
-   0.1.0 - Using [@phated's](https://github.com/phated/circom/tree/phated/wast-dep) `wast-dep` fork
    of circom which eliminates the need for `wabt` as a node dependency. The code for retrying
    folder deletions is more robust. Now `--version` includes the version information for the
    `circom2` npm package as well as the underlying `circom`. Specify compatibility with `node`
    versions 15.0.0 and higher (requires
    [i64 wasm](https://github.com/WebAssembly/proposals/issues/7) support). Updated `circom` to
    `2.0.3`. Added tests to check the behavior of the implementation.
-   0.0.6 - Updated `circom` to version `2.0.2`
-   0.0.5 - Vendored a copy of `@wasmer/wasi` with a patch that fixed broken `r1cs` generation
-   0.0.4 - Fix `include` of other files and relative and absolute paths
-   0.0.3 - Allow running on files other than current directory
-   0.0.2 - Fix command line package
-   0.0.1 - Initial package
