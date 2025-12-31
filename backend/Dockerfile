# Dockerfile para Node.js API (backend)
FROM node:18-alpine

# Crear usuario no-root (opcional pero buena práctica)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S api -u 1001

WORKDIR /app

# Copiar package.json primero (para cache de capas)
COPY package*.json ./

# Instalar dependencias de PRODUCCIÓN solo
RUN npm ci --only=production

# Copiar código fuente
COPY --chown=api:nodejs . .

# Crear directorio para uploads
RUN mkdir -p uploads && chown -R api:nodejs uploads

# Cambiar a usuario no-root
USER api

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=5000

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Comando de inicio
CMD ["node", "server.js"]