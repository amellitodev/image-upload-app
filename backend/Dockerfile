# Dockerfile para Node.js API (backend) - VERSIÓN CORREGIDA
FROM node:18-alpine

WORKDIR /app

# Copiar package.json primero (para cache de capas)
COPY package*.json ./

# INSTALAR con npm install (NO npm ci) porque no tienes package-lock.json
RUN npm install --production --no-audit --no-fund

# Copiar código fuente
COPY . .

# Crear directorio para uploads
RUN mkdir -p uploads && chmod 755 uploads

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=5000

# Exponer puerto
EXPOSE 5000

# Comando de inicio
CMD ["node", "server.js"]