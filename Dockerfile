FROM node:10.23

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build
