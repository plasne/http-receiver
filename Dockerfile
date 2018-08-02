FROM node:10-alpine
COPY receiver.js receiver.js
COPY package.json package.json
COPY package-lock.json package-lock.json
ENV  PORT 80
RUN  npm install
CMD  node receiver