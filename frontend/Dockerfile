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

ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_DATABASE_URL
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID
ARG HASURA

ENV REACT_APP_FIREBASE_API_KEY=$FIREBASE_API_KEY
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
ENV REACT_APP_FIREBASE_DATABASE_URL=$FIREBASE_DATABASE_URL
ENV REACT_APP_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV REACT_APP_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID
ENV REACT_APP_FIREBASE_APP_ID=$FIREBASE_APP_ID
ENV REACT_APP_HASURA=$HASURA

# Build environment
RUN npm run build

# nginx state for serving content
FROM nginx:1.21.0-alpine

# Copy static assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html/

# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose Port
# EXPOSE 80
EXPOSE 1000

# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]

        
        
        