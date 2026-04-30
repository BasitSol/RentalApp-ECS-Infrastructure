# -------- Stage 1: Build --------
FROM node:18-alpine AS builder

WORKDIR /app

ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

COPY package*.json ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

COPY public ./public
COPY scripts ./scripts
COPY src ./src

RUN npm run build

# -------- Stage 2: Nginx --------
FROM nginxinc/nginx-unprivileged:stable-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build files only
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]