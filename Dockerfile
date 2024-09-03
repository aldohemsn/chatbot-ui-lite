# Stage 1: Build
FROM node:20-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./

# Install dependencies only when needed
RUN npm install 

COPY . .

# Uncomment if your application requires a build step
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy built assets from the builder stage
COPY --from=builder /usr/src/app .

# Only copy the runtime dependencies necessary from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose the port the app runs on, changed to 3000 as requested
EXPOSE 3000

# Define environment variables for OPENAI_API_KEY and DAVINCI_TURBO
# These will be overridden if specified at runtime
ENV OPENAI_API_KEY=""
ENV GPT_MODEL=""
ENV CUSTOM_CONTENT=""

# Define the command to run your app
CMD [ "npm", "run", "start" ]

