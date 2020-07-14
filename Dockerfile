FROM golang:alpine3.12 AS build

# install build tools
RUN apk add --update gcc musl-dev

WORKDIR /home/build

COPY . .

RUN go build -o=goauth2

# RELEASE image
FROM alpine:3.12

WORKDIR /home/dv4all

COPY --from=build /home/build/goauth2 /home/dv4all
COPY ./views /home/dv4all/views

EXPOSE 5432
EXPOSE 8080

CMD ["/home/dv4all/goauth2"]

