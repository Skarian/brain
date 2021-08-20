FROM node:12-alpine

# build tools for native dependencies
RUN apk add --update make gcc g++ python git

# Installing graphicsmagick and dependencies
RUN apk add --no-cache gettext librsvg ghostscript imagemagick graphicsmagick

# Install Libreoffice & Common Fonts
RUN apk --no-cache add bash libreoffice util-linux \
  ttf-droid-nonlatin ttf-droid ttf-dejavu ttf-freefont ttf-liberation \
&& rm -rf /var/cache/apk/*

# Install Java
RUN apk add openjdk8

# Copy Server Files
WORKDIR /usr/src/app
COPY package*.json ./

# Setup Server
RUN npm install
COPY . .
EXPOSE 5000
RUN ls -ls
CMD ["npm", "run", "start"]