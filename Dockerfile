# Use a specific version of Node.js (e.g., LTS)
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only dependency files for caching
COPY package.json package-lock.json ./

# Install dependencies in production mode
RUN npm ci --only=production

# Copy the remaining code
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose port 8000
EXPOSE 8000

# Create a user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the server
CMD ["node", "./src/server.js"]
