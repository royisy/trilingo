FROM node:18-alpine

WORKDIR /app

RUN apk update
RUN apk add --no-cache \
    git
