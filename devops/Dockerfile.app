FROM node:current-alpine3.10 AS builder

WORKDIR /app
COPY . .

FROM nginx:stable-alpine
RUN apk add --no-cache jq
COPY default.conf /etc/nginx/conf.d/default.conf
RUN mkdir /usr/share/nginx/html/sample
COPY --from=builder /app/examples/web/cdn /usr/share/nginx/html/sample
COPY --from=builder /app/examples/web/react/build /usr/share/nginx/html/sample/react

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
