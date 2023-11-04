.PHONY: generate.buf
generate.buf:
	protoc --go_out=pkg/pb --go_opt=paths=source_relative \
	--go-grpc_out=pkg/pb --go-grpc_opt=paths=source_relative \
	proto/dnv/v1/*.proto
	$(call format)

.PHONY: run.server
run.server:
	go run main.go

define format
	@go fmt ./... 
	@go run github.com/bufbuild/buf/cmd/buf format -w
	@go run golang.org/x/tools/cmd/goimports -w ./ 
	@go mod tidy
endef