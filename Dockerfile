# Use the official Node.js 14 image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# # Copy the package.json and package-lock.json files to the container
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code to the container
# COPY . .

# # Build the application
# RUN npx quasar build

# Set the working directory to /app/dist/spa
WORKDIR /app/dist/spa

# Expose port 80
EXPOSE 80

# Start the server
CMD ["npx", "http-server", "-p", "80"]