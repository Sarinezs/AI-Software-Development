FROM node:lts

WORKDIR /usr/src/app

COPY /package.json ./

RUN npm install --force

COPY . .

EXPOSE 5173

CMD [ "npm", "start" ]
