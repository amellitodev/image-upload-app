FROM node:18-alpine

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache bash

WORKDIR /app

# Copiar archivos de package primero
COPY package.json .

# Instalar dependencias de forma explícita
RUN npm config set registry https://registry.npmjs.org/
RUN npm install express@4.18.2
RUN npm install cors@2.8.5
RUN npm install multer@1.4.5-lts.1

# Copiar el resto
COPY server.js .
COPY . .

# Crear directorios necesarios
RUN mkdir -p uploads && chmod 755 uploads

# Limpiar cache
RUN npm cache clean --force

# Variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]