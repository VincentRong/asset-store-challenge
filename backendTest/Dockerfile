FROM node:20.18.0-alpine AS base

WORKDIR /usr/src/appTest

COPY package.json package-lock.json ./

COPY . .

CMD ["/bin/sh", "-c" , "npm install && npm run test"]
