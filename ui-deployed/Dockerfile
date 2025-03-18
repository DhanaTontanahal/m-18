# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory inside Docker
WORKDIR /app

# Copy package files first (for caching efficiency)
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies)
RUN npm install

# Copy all remaining files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NODE_PATH=./

# Remove any previous Next.js build (prevents cache issues)
RUN rm -rf .next

# Build Next.js (ensure `output: "standalone"` in next.config.mjs)
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
