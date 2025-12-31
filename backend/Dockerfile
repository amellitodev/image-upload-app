FROM node:18-alpine

WORKDIR /app

# Copiar TODO el contenido del directorio actual
COPY . .

# Instalar dependencias
RUN npm install --production --no-audit --no-fund

# Crear carpeta uploads si no existe
RUN mkdir -p uploads

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=5000

# Exponer puerto
EXPOSE 5000

# Comando de inicio
CMD ["node", "server.js"]