# Use a lean Node image for better performance and smaller size
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install Angular CLI globally (if you prefer, but often better to install locally)
# Using local installation via package.json is generally the best practice for CI/CD
# However, to match your original, we'll keep the global install for development simplicity.
RUN npm install -g @angular/cli@20

# Copy only the dependency files
COPY package.json package-lock.json ./

# Install dependencies
# We use --silent for cleaner output
RUN npm install --silent

# Expose the port (4200 is Angular's default dev port)
EXPOSE 4200

# The CMD is just a placeholder. The actual run command will be in docker-compose.yml.
# We include it here as a fallback or for a single 'docker run' scenario.
# We add '--poll 2000' to address file-watching issues with Docker volumes,
# which you already included and is a good practice for this setup.
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]