# BUILD

# Create image based on the official Node 7.5 image from dockerhub
FROM node:7.5.0 as builder
# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app
# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app
# Copy dependency definitions
COPY package.json /usr/src/app
# Install dependecies
RUN npm install
# Get all the code needed to run the app
COPY . /usr/src/app
RUN npm run build-prod


# SERVE

FROM nginx:1.13.3-alpine
## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /usr/src/app /usr/src/app

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]