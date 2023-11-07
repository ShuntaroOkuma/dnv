.PHONY: run.server
run.server:
	go run main.go

.PHONY: test
test:
	grpcurl -plaintext localhost:8888 list
  grpcurl -plaintext localhost:8888 dnv.v1.Dnv.RunScript
	$(call format)

define format
	@go fmt ./... 
	@go run github.com/bufbuild/buf/cmd/buf format -w
	@go run golang.org/x/tools/cmd/goimports -w ./ 
	@go mod tidy
endef