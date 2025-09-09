# Use development server (simpler and more reliable)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Verify assets are copied
RUN ls -la public/assets/cards/

# Expose port 3000
EXPOSE 3000

# Start development server
CMD ["npm", "start"]
