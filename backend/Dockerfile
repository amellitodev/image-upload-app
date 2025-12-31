FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies based on package.json; use cache efficiently
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Create uploads dir and use a non-root user
RUN mkdir -p /app/uploads \
	&& addgroup -S appgroup \
	&& adduser -S appuser -G appgroup \
	&& chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]