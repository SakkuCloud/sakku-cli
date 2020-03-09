FROM node:12-alpine

COPY ./ /src

WORKDIR /src
RUN npm install

CMD ["npm", "start"]

EXPOSE 3000