FROM node:current-alpine3.10 AS builder

WORKDIR /app
COPY . .

FROM nginx:stable-alpine
RUN apk add --no-cache jq
COPY default.conf /etc/nginx/conf.d/default.conf
RUN mkdir /usr/share/nginx/html/sample
COPY --from=builder /app/examples/web/cdn /usr/share/nginx/html/sample
COPY --from=builder /packages/hcl-sdk-web-ui/dist/hcl-sdk /usr/share/nginx/html/sample/hcl-sdk-web-ui
COPY --from=builder /packages/hcl-sdk-api/dist/hcl-sdk-api /usr/share/nginx/html/sample/hcl-sdk-api
COPY --from=builder /packages/hcl-sdk-web-devtools/dist /usr/share/nginx/html/sample/hcl-sdk-tools

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
