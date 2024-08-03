# Use the official Node.js 20 image
FROM node:20-alpine as build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm i

# Copy the project files
COPY . .

# Build the React app
RUN npm run build

#nginx stage
FROM nginx:1.21-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]