# Install dependencies only when needed
FROM node:22-alpine AS deps
WORKDIR /app

# Copy package.json and package-lock.json first (for better build cache)
COPY package.json package-lock.json ./

RUN npm ci

# Build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy only necessary files
FROM node:20-alpine AS runner
WORKDIR /app

# Set NODE_ENV production
ENV NODE_ENV=production

# Copy built app and dependencies
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Start the Next.js app
CMD ["npm", "start"]
