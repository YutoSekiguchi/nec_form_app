FROM node:18.15

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "server/view.js"]