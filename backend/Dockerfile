FROM python:3.10-alpine

WORKDIR /app

RUN apk update
RUN apk add --no-cache \
    git

RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt
