FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

EXPOSE 80
EXPOSE 443
EXPOSE 8080

WORKDIR /usr/src/app/client
COPY /client/dist dist

WORKDIR /usr/src/app/server
COPY /server/package*.json ./
COPY /server/dist dist
RUN [ "npm", "install" ]

CMD [ "node", "./dist/server.js" ]