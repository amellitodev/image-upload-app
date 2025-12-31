FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias (usa install, no ci)
RUN npm install --production

# Copiar todo el código
COPY . .

# Crear carpeta para uploads
RUN mkdir -p uploads && chmod 755 uploads

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=5000

# Exponer puerto
EXPOSE 5000

# Comando de inicio
CMD ["node", "server.js"]