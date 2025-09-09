# Docker Setup for Exploding Kittens Frontend

This document explains how to run the Exploding Kittens frontend using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and run the container
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

The frontend will be available at: http://localhost:3000

### Option 2: Using Docker directly

```bash
# Build the image
docker build -t exploding-kittens-frontend .

# Run the container
docker run -p 3000:3000 exploding-kittens-frontend
```

## Custom Port

To run on a different port (e.g., 8080):

```bash
# Using Docker Compose
docker-compose up --build -p 8080:3000

# Using Docker directly
docker run -p 8080:3000 exploding-kittens-frontend
```

## Backend Communication

The frontend is configured to communicate with backend services on:
- **Player Service**: localhost:8080
- **Lobby Service**: localhost:8081  
- **Game Service**: localhost:8082

### For Docker Network Communication

If your backend services are also running in Docker containers, you'll need to:

1. Create a shared network:
```bash
docker network create exploding-kittens-network
```

2. Run the frontend on the shared network:
```bash
docker run -p 3000:3000 --network exploding-kittens-network exploding-kittens-frontend
```

3. Run your backend services on the same network and update the frontend configuration to use service names instead of localhost.

## Development vs Production

This Docker setup is optimized for **production** use. For development:

1. Use `npm start` directly on your host machine
2. Or modify the Dockerfile to use the development server instead of nginx

## Troubleshooting

### Container won't start
- Check if port 3000 is already in use: `lsof -i :3000`
- Use a different port: `docker run -p 8080:3000 exploding-kittens-frontend`

### Can't connect to backend
- Ensure backend services are running on the expected ports
- Check if backend services are accessible from the container's network
- For Docker networks, use service names instead of localhost

### Build fails
- Ensure you have sufficient disk space
- Try clearing Docker cache: `docker system prune -a`

## Stopping the Container

```bash
# Using Docker Compose
docker-compose down

# Using Docker directly
docker stop <container-id>
```

## Useful Commands

```bash
# View running containers
docker ps

# View container logs
docker logs <container-id>

# Access container shell
docker exec -it <container-id> sh

# Remove container and image
docker-compose down --rmi all
```
