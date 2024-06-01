FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
