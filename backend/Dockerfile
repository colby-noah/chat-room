# ---------- build stage ----------
FROM ubuntu:24.04 AS build
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential cmake git curl zip unzip tar pkg-config ca-certificates \
    libssl-dev zlib1g-dev libuv1-dev \
 && rm -rf /var/lib/apt/lists/*

# libbcrypt (installs headers and libbcrypt.so under /usr/local)
RUN git clone --depth 1 https://github.com/trusch/libbcrypt /tmp/libbcrypt \
 && cmake -S /tmp/libbcrypt -B /tmp/libbcrypt/build \
 && cmake --build /tmp/libbcrypt/build -j"$(nproc)" \
 && cmake --install /tmp/libbcrypt/build

# ScyllaDB C++ driver (the shared library the Makefile links against)
RUN git clone --depth 1 https://github.com/scylladb/cpp-driver /tmp/cpp-driver \
 && cmake -S /tmp/cpp-driver -B /tmp/cpp-driver/build -DCMAKE_BUILD_TYPE=Release \
 && cmake --build /tmp/cpp-driver/build -j"$(nproc)" \
 && cp -a /tmp/cpp-driver/build/libscylla-cpp-driver.so* /usr/local/lib/ \
 && ldconfig

# vcpkg libraries (jwt-cpp, nlohmann-json, uWebSockets, uSockets)
RUN git clone --depth 1 https://github.com/microsoft/vcpkg /opt/vcpkg \
 && /opt/vcpkg/bootstrap-vcpkg.sh -disableMetrics \
 && /opt/vcpkg/vcpkg install jwt-cpp nlohmann-json uwebsockets usockets

# Build the server, overriding the Makefile's laptop-specific paths
WORKDIR /app
COPY . .
RUN make VCPKG_DIR=/opt/vcpkg/installed/x64-linux \
         SCYLLA_LIB="-lscylla-cpp-driver" \
         LIBS="-lbcrypt -lz -lssl -lcrypto -ldl -luSockets"

# ---------- runtime stage ----------
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y --no-install-recommends \
    libssl3 zlib1g libuv1 ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY --from=build /usr/local/lib/libbcrypt* /usr/local/lib/libscylla-cpp-driver.so* /usr/local/lib/
RUN ldconfig
WORKDIR /app
COPY --from=build /app/server.out .
EXPOSE 8080 8081
CMD ["./server.out"]
