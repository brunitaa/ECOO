FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL=http://localhost:3001/api
ARG VITE_URL_CIUDADANO=http://localhost:5173
ARG VITE_URL_CAJA=http://localhost:5174
ARG VITE_URL_ADMIN=http://localhost:5175
ENV VITE_API_URL=$VITE_API_URL VITE_URL_CIUDADANO=$VITE_URL_CIUDADANO VITE_URL_CAJA=$VITE_URL_CAJA VITE_URL_ADMIN=$VITE_URL_ADMIN
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
