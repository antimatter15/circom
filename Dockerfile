FROM rust:slim-buster as build-stage
RUN apt-get update && apt-get install -y curl wget libssl1.1 libcurl3-gnutls build-essential
RUN cargo install wasm-pack
COPY . /src
WORKDIR /src/circom
RUN wasm-pack build --target nodejs --out-dir ../pkg
FROM scratch
COPY --from=build-stage /src/pkg/circom_bg.wasm /circom.wasm
