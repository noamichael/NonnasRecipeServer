FROM node:12-alpine

# set working directory
WORKDIR /app

COPY package* ./
RUN npm install

COPY . ./
RUN npm run build

ENTRYPOINT [ "node", "server"]