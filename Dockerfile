# Use the official Node.js 14 image
FROM node:14

ARG HOST_URL=http://localhost
ENV HOST_URL=${HOST_URL}

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm i -g @quasar/cli 

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN ADMIN_URL=${HOST_URL}:8100 CHAT_URL=${HOST_URL}:8000 quasar build

# Set the working directory to /app/dist/spa
WORKDIR /app/dist/spa

# Expose port 4000
EXPOSE 4000

# Start the server
CMD ["sh", "-c", "ADMIN_URL=$HOST_URL:8100 CHAT_URL=$HOST_URL:8000 quasar serve"]