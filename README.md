# dnv

docker network visualization using openai

## Overview

- English
  This app visualizes the network of Docker containers.
  Without it, you'd need to manually enter commands and decode the output to grasp your network's layout. With this app, you can instantly see and comprehend your network's structure.

  By starting a gRPC server (Go language) and launching a gRPC client (React/JavaScript), you can use it.

  The network information of the environment where the gRPC server is started is acquired, and the content is converted to a Mermaid model using the OpenAI API.

  Three patterns are output to reduce the deviation of the OpenAI response.

  Press the CREATE MERMAID button from the browser to query the OpenAI API and display the results. However, please note that it may take more than 1 minute.

- Japanese
  このアプリは、Docker コンテナのネットワークを可視化するアプリです。
  通常、コンテナを含むマシン環境のネットワークの状態を把握するには、コマンドを１つ１つ入力して表示される文字を読み解く必要があります。
  しかし、このアプリを使うことで、使っている環境のネットワークを可視化し、すぐに理解することができます。

  gRPC サーバー(Go 言語)を起動し、gRPC クライアント（React/JavaScript）を介して、API を起動することで、利用できます。

  gRPC サーバーを起動した環境のネットワーク情報を取得し、その内容を OpenAI API を利用して、Mermaid 型式に変換します。

  3 つのパターンを出力するようにしており、OpenAI の回答のズレを減らします。

  ブラウザから CREATE MERMAID ボタンを押すことで、OpenAI API に問い合わせ、結果を表示します。ただし、１分以上の時間がかかることに注意してください。

## Requirements

- docker: Docker version 24.0.5, build ced0996
- docker-compose: Docker Compose version v2.20.2-desktop.1
- golang: go version go1.19.13 darwin/arm64
- node: v18.17.1
- yarn: 1.22.19

## How to use

### 1. Run gRPC server

[api/README.md](api/README.md)

### 2. Run web app with proxy

[app/README.md](app/README.md)

## Generate protocol buffer files

```sh
docker build -t protobuf-builder .
docker run --rm --name protobuf-builder -v `pwd`:/var/work protobuf-builder
```
