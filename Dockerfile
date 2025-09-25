# Simple working Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Copy only the assets (not index.html which gets overwritten by build)
RUN cp -r public/assets build/
RUN cp public/favicon.ico build/
RUN cp public/logo*.png build/
RUN cp public/manifest.json build/
RUN cp public/robots.txt build/

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
