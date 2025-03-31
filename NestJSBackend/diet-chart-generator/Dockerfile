# Multi-stage build for better compatibility
FROM --platform=linux/amd64 node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install build dependencies
RUN apk add --no-cache make gcc g++ python3 py-pip

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Install only production dependencies and bcrypt
RUN apk add --no-cache make gcc g++ python3 && \
    npm ci --only=production && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python3

# Expose API port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]