FROM node:18

WORKDIR /app

RUN apt-get update
RUN apt-get install -y \
    git

RUN npm install -g npm
RUN npm install -g @aws-amplify/cli

USER node
