# Circom 2.0 WASM

This is a proof of concept of Circom 2.0 compiled to WASM.

This is only an experiment and has not been adequately tested!

## Changelog

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
