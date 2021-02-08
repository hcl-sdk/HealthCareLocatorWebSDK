FROM node:15

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build-web && yarn build-devtools && cp -R ./packages/hcl-sdk-web-ui/dist/hcl-sdk ./examples/web/cdn && cp -R ./packages/hcl-sdk-web-devtools/dist/devtools ./examples/web/cdn 


EXPOSE 3000

CMD [ "node", "./examples/web/cdn/app.js"]
