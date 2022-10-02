FROM python:3.10-alpine

WORKDIR /app

RUN apk update
RUN apk add --no-cache \
    git \
    mariadb-dev gcc libc-dev \
    mysql-client \
    build-base libffi-dev
