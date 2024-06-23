# Use the official Node.js 20 image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the project files
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=512
# Build the React app
RUN npm run build

# Serve the React app
RUN npm install -g serve
CMD ["serve", "-s", "build"]
