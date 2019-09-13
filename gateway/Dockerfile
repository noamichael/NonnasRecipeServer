FROM node:12-alpine

# set working directory
WORKDIR /app
COPY . ./

RUN npm install

EXPOSE 8282

ENTRYPOINT [ "node", "server"]