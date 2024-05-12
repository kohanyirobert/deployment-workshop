FROM node:22-alpine AS build
EXPOSE 4173
WORKDIR /app
COPY . .
RUN npm install
CMD [ "npm", "run", "preview", "--", "--host", "0.0.0.0" ]
