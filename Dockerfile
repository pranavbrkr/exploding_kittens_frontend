# Multi-stage build for React app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build arguments for environment variables (with defaults)
ARG REACT_APP_PLAYER_SERVICE_URL=http://localhost:8080
ARG REACT_APP_LOBBY_SERVICE_URL=http://localhost:8081
ARG REACT_APP_GAME_SERVICE_URL=http://localhost:8082
ARG REACT_APP_LOBBY_WS_URL=ws://localhost:8081/ws/lobby
ARG REACT_APP_GAME_WS_URL=ws://localhost:8082/ws-game

# Set environment variables for build (React needs these at build time)
ENV REACT_APP_PLAYER_SERVICE_URL=$REACT_APP_PLAYER_SERVICE_URL
ENV REACT_APP_LOBBY_SERVICE_URL=$REACT_APP_LOBBY_SERVICE_URL
ENV REACT_APP_GAME_SERVICE_URL=$REACT_APP_GAME_SERVICE_URL
ENV REACT_APP_LOBBY_WS_URL=$REACT_APP_LOBBY_WS_URL
ENV REACT_APP_GAME_WS_URL=$REACT_APP_GAME_WS_URL

# Build the app
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Ensure assets directory exists and is properly copied
# The build process should already include assets, but we verify
RUN ls -la /usr/share/nginx/html/ || true && \
    ls -la /usr/share/nginx/html/assets/ 2>/dev/null || echo "Assets directory check"

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
