FROM golang:1.19

RUN apt-get update
RUN apt-get install sudo
RUN apt-get install -y protobuf-compiler
RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt install -y nodejs npm
RUN npm -g install protoc-gen-grpc-web
RUN npm -g install protoc-gen-js
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest \
    && go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
COPY ./run_protoc.sh /var/work/
COPY ./proto /var/work/proto
WORKDIR /var/work/

CMD ["bash", "run_protoc.sh"]