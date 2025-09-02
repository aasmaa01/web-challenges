# Backend Dockerfile
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose backend port
EXPOSE 5000

# Run the server
CMD ["npm", "start"]
