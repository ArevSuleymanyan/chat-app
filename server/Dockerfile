FROM node:16.10.0
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
CMD ["npm", "run", "start"]
EXPOSE 3000
EXPOSE 80
EXPOSE 8080