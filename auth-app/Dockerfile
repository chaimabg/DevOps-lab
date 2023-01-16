FROM node:18-bullseye
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 5000
ENV MONGOOSE_CONNECTION='mongodb+srv://admin:admin@cluster0.dfptgir.mongodb.net/?retryWrites=true&w=majority'
ENV GITHUB_APP_URL=http://localhost:8088
ENV JWT_SECRET_KEY=devops
CMD npm start