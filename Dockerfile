# -- First Stage: Compile TypeScript
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# -- Second Stage: Production image
FROM node:20-alpine AS production
WORKDIR /app

# Installing only production deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Create non-root user for better security
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001
USER appuser

EXPOSE 3000
HEALTHCHECK --interval=30s CMD wget -q --spider http://localhost:3000/health || exit 1
CMD ["node", "dist/server.js"]