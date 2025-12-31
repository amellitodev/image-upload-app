FROM node:18-alpine

WORKDIR /app

# Instalar dependencias una por una (evita problemas)
RUN npm install express@4.18.2
RUN npm install cors@2.8.5
RUN npm install multer@1.4.5-lts.1
RUN npm install dotenv@16.3.1
RUN npm install helmet@7.0.0
RUN npm install morgan@1.10.0

# Copiar código
COPY server.js .
COPY . .

# Crear carpeta uploads
RUN mkdir -p uploads

# Variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]