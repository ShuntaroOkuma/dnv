# Run grpc server

## 0. prepare environment

### set open api key

- create `.env` file
- set `OPENAI_API_KEY` in `.env` file
- for example:

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### install go modules

```bash
go get
```

## 1. run grpc server

```bash
make run.server
```

# 2. test using gRPCurl

```bash
grpcurl -plaintext localhost:8888 list
grpcurl -plaintext localhost:8888 dnv.v1.Dnv.RunScript
```
