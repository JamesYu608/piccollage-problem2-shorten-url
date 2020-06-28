FROM node:12.18.0

WORKDIR /usr/app

COPY ./wait-for-it.sh ./
RUN chmod +x ./wait-for-it.sh

COPY ./package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]
