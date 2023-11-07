# Run web app with proxy

## 0. Build proxy

```sh
docker build -t dnv/envoy .
```

## 1. run proxy

```sh
docker run --name dnv-envoy -ti -v "$(pwd)"/envoy.yaml:/etc/envoy/envoy.yaml:ro -p 8080:8080 -p 9901:9901 envoyproxy/envoy:v1.22.0
```

## 2. run web app

```sh
yarn start
```
