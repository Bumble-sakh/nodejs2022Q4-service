FROM node:alpine AS build-env

WORKDIR /usr/service

COPY . .

RUN npm ci

FROM node:alpine

EXPOSE 4000

WORKDIR /usr/service

COPY --from=build-env /usr/service .