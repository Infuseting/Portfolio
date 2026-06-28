# ── 1. BUILD STAGE ───────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack for modern package managers if needed, but we use npm here
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── 2. RUNTIME STAGE ─────────────────────────────────────────────
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static build from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
