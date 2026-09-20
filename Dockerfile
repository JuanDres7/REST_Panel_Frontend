# syntax=docker/dockerfile:1
FROM node:24.21.0-alpine3.23 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG APP_ENV
ARG VITE_API_URL
RUN test -n "$APP_ENV" && test -n "$VITE_API_URL"
ENV VITE_API_URL=${VITE_API_URL}
RUN if [ "$APP_ENV" = "local" ]; then npm run build:local; elif [ "$APP_ENV" = "test" ]; then npm run build:test; else npm run build; fi

FROM nginx:1.28-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
