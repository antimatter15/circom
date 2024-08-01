FROM rust:1.87-bookworm AS build-stage
COPY . /src
RUN rustup target add wasm32-wasip1
RUN cd /src/circom && cargo build --target wasm32-wasip1 --release
FROM scratch
COPY --from=build-stage /src/target/wasm32-wasip1/release/circom.wasm /
