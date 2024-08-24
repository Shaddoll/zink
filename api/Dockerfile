FROM golang:1.21.5-alpine AS builder

WORKDIR /app

# Copy go mod dependencies and try to share the module download cache
COPY go.* ./
RUN go mod download

COPY . .

RUN go build -ldflags '-s -w' -o app cmd/server/main.go

FROM alpine:3.18

WORKDIR /app

COPY --from=builder /app/app .

EXPOSE 8080

CMD ["./app"]
