FROM node:18

# set working directory
WORKDIR /app

COPY package* ./
RUN npm install

COPY . ./
RUN npm run build

USER 1001

EXPOSE 8080

ENTRYPOINT [ "node", "server"]
