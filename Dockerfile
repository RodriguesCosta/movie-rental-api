FROM node:18-alpine

WORKDIR /app-run

COPY package*.json ./

RUN npm ci

ADD . ./

EXPOSE 3333

CMD ["npm", "run", "start"]
