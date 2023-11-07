- run grpc server

  ```bash
  make run.server
  ```

- test using gRPCurl

  ```bash
  grpcurl -plaintext localhost:8888 list
  grpcurl -plaintext localhost:8888 dnv.v1.Dnv.RunScript
  grpcurl -plaintext -d '{"scriptResult": "hoge", "gptRequest":"geho"}' localhost:8888 dnv.v1.Dnv.GetMermaid
  ```
