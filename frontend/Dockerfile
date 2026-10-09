# ---------- build the Vue app ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ---------- serve it with Nginx ----------
FROM nginx:alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/frontend
EXPOSE 80 443
