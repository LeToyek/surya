# Dockerfile
# Instructions for building the Next.js application image.

# Stage 1: Base dependencies
# Use an official Node.js image. Alpine versions are smaller.
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies needed for some native Node.js modules.
# Optional but good practice for compatibility.
RUN apk add --no-cache libc6-compat

# Stage 2: Install dependencies
# This stage is separated to leverage Docker's layer caching.
# Dependencies are only re-installed if package.json or package-lock.json changes.
FROM base AS deps
WORKDIR /app

# Copy package definition files.
COPY package.json package-lock.json* ./

# Install project dependencies.
RUN npm install

# Stage 3: Build the application for development
# Copy the installed dependencies and application code.
FROM base AS runner
WORKDIR /app

# Copy dependencies from the 'deps' stage.
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application code.
COPY . .

# Expose the port that Next.js runs on.
EXPOSE 3000

# The command to start the Next.js development server.
# This will be run when the container starts.
CMD ["npm", "run", "dev"]
