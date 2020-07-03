FROM node:12.14.0-alpine3.11

RUN apk add --no-cache bash

RUN touch /home/node/.bashrc | echo "PS1='\w\$ '" >> /home/node/.bashrc

RUN npm config set cache /home/node/app/.npm-cache --global

RUN npm i -g @nestjs/cli@7.0.0

USER node

WORKDIR /home/node/app
