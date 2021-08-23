FROM node:12-alpine

# Installing graphicsmagick and dependencies
RUN apk add --no-cache gettext librsvg ghostscript imagemagick graphicsmagick

# Install Libreoffice & Common Fonts
RUN apk add --no-cache bash libreoffice util-linux \
  ttf-droid-nonlatin ttf-droid ttf-dejavu ttf-freefont ttf-liberation \
&& rm -rf /var/cache/apk/*

# Copy Server Files
WORKDIR /usr/src/app
# COPY package*.json ./
COPY backend/package*.json ./

# Setup Server
RUN npm install
# COPY . .
COPY backend .
EXPOSE 5000
RUN ls -ls
CMD ["npm", "run", "start"]