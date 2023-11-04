- proto ファイル生成

  ```bash
  make generate.buf
  ```

- grpc サーバー起動

  ```bash
  make run.server
  ```

- gRPCurl によるテスト

  ```bash
  grpcurl -plaintext localhost:8888 list
  grpcurl -plaintext localhost:8888 dnv.v1.Dnv.RunScript
  grpcurl -plaintext -d '{"scriptResult": "hoge", "gptRequest":"geho"}' localhost:8888 dnv.v1.Dnv.GetMermaid
  ```
