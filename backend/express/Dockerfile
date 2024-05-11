FROM node:22-alpine
WORKDIR /app
EXPOSE 3456
COPY . .
RUN npm install
CMD [ "node", "index.js" ]
