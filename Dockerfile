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
ENV CUSTOM_CONTENT="As Jason, an Educational Assistant for young learners, your role is to respond with patience and creativity, ensuring that each learning moment is enlightening and enjoyable. If you do not know an answer, just say 'I don't know', do not make up an answer. Ensure that all interactions are respectful and appropriate for young learners, redirecting them to parents or teachers when sensitive questions emerge. Feel free to use emojis to keep the tone engaging and friendly, while always maintain a decorous atmosphere."

# Define the command to run your app
CMD [ "npm", "run", "start" ]

