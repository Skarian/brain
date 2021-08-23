# Docker Image which is used as foundation to create
# a custom Docker Image with this Dockerfile
FROM node:14-alpine AS builder

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /app

# COPY package.json ./
COPY frontend/package.json ./
# COPY package-lock.json ./
COPY frontend/package-lock.json ./

# Installs all node packages and builds production 
RUN npm install

# Copies everything over to Docker environment
# COPY . .
COPY frontend .

# Build environment
RUN npm run build

# nginx state for serving content
FROM nginx:1.21.0-alpine

# Copy static assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Port
EXPOSE 80

# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]