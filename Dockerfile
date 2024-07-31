FROM debian:buster-slim as build-stage
RUN apt-get update && apt-get install -y curl wget libssl1.1 libcurl3-gnutls build-essential
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN curl https://raw.githubusercontent.com/second-state/rustwasmc/master/installer/init.sh -sSf | sh
RUN wget https://github.com/WebAssembly/binaryen/releases/download/version_111/binaryen-version_111-x86_64-linux.tar.gz && tar -xvf binaryen-version_111-x86_64-linux.tar.gz -C / --strip-components=1
COPY . /src
RUN rustwasmc build --enable-aot /src/circom
FROM scratch
COPY --from=build-stage /src/target/wasm32-wasi/release/circom.wasm /
