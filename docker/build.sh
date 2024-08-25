#!/bin/bash

docker buildx build --platform linux/amd64,linux/arm64 -t elshaddai/zink-api:main ../api
docker buildx build --platform linux/amd64,linux/arm64 -t elshaddai/zink-web:main ../web
