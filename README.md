# dnv

docker network visualization using openai

# generate protocol buffer files

```sh
docker build -t protobuf-builder .
docker run --rm --name protobuf-builder -v `pwd`:/var/work protobuf-builder
```
