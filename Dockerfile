FROM node:dubnium as build-deps
WORKDIR /code
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM alpine:latest
WORKDIR /code/static
COPY --from=build-deps /code/build /code/static/
