# Use a small Node image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# App listens on port 4000
EXPOSE 4000

# Start the server
CMD ["npm", "start"]