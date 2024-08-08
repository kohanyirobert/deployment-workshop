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
ARG UPSTREAM_HOST
ENV UPSTREAM_HOST=$UPSTREAM_HOST
RUN apk add --no-cache gettext
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
RUN envsubst '${UPSTREAM_URL} ${UPSTREAM_HOST}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]