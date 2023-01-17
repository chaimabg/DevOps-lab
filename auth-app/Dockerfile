FROM node:18-bullseye
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD npm start