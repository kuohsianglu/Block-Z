FROM node:20-alpine

RUN apk add --no-cache docker-cli

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

ENV PORT 3000
EXPOSE 3000

CMD ["npm", "run", "start"]
