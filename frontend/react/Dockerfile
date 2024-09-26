FROM node:22-alpine AS build
ARG VITE_APP_TITLE
ENV VITE_APP_TITLE=$VITE_APP_TITLE
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
ARG UPSTREAM_URL
ENV UPSTREAM_URL=$UPSTREAM_URL
RUN apk add --no-cache gettext
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
EXPOSE 80
CMD ["bash", "-c", "envsubst '${UPSTREAM_URL}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g daemon off;"]