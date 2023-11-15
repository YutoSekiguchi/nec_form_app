FROM golang:1.19

WORKDIR /app

COPY . .
RUN go mod tidy
EXPOSE 8080

RUN go install github.com/cosmtrek/air@v1.40.4
CMD ["air"]