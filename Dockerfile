FROM node
WORKDIR /nodejs-app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
