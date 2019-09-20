FROM node:dubnium as build-deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM alpine:latest
WORKDIR /app/static
COPY --from=build-deps /app/build /app/static/
