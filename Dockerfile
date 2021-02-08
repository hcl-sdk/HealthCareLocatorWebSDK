FROM node:15


WORKDIR /app

COPY package.json ./app/
COPY lerna.json ./app/
COPY yarn*.json ./app/

RUN cd ./app && yarn install

COPY . ./app/

RUN cd ./app && yarn build-web && yarn build-devtools && cp -R ./packages/hcl-sdk-web-ui/dist/hcl-sdk ./examples/web/cdn && cp -R ./packages/hcl-sdk-web-devtools/dist/devtools ./examples/web/cdn 


EXPOSE 5000

CMD [ "npx", "serve", "./app/examples/web/cdn" ]
