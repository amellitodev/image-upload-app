# Usar una imagen con dependencias preinstaladas
FROM node:18-alpine

# Instalar dependencias GLOBALMENTE (evita problemas de permisos)
RUN npm config set registry https://registry.npmjs.org/ && \
    npm install -g express@4.18.2 cors@2.8.5 multer@1.4.5-lts.1 dotenv@16.3.1

WORKDIR /app

# Copiar solo el código de la aplicación
COPY server.js .

# Crear carpeta para uploads
RUN mkdir -p uploads && chmod 755 uploads

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=5000
ENV NODE_PATH=/usr/local/lib/node_modules

# Exponer puerto
EXPOSE 5000

# Comando de inicio
CMD ["node", "server.js"]