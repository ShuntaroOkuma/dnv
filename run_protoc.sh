protoc \
  --go_out=./api/pkg/ --go_opt=paths=source_relative \
  --go-grpc_out=./api/pkg/ --go-grpc_opt=paths=source_relative \
  proto/*.proto

protoc \
  --js_out=import_style=commonjs,binary:./app/src/ \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./app/src/ \
  proto/*.proto
  