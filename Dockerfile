FROM node:current-alpine3.10 AS builder

WORKDIR /app
COPY . .

RUN npm ci

RUN yarn build-web && yarn build-devtools && cp -R ./packages/hcl-sdk-web-ui/dist/hcl-sdk ./examples/web/cdn && cp -R ./packages/hcl-sdk-web-devtools/dist/devtools ./examples/web/cdn 


FROM nginx:stable-alpine
RUN apk add --no-cache jq
COPY default.conf /etc/nginx/conf.d/default.conf
RUN mkdir /usr/share/nginx/html/sample
COPY --from=builder /app/examples/web/cdn /usr/share/nginx/html/sample

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
