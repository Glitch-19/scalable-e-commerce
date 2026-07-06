FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Note: Just update this port number for each service (3001, 3002, 3000)
EXPOSE 3000
CMD ["node", "server.js"]