# Dockerfile MÁS SIMPLE POSIBLE
FROM node:18-alpine

WORKDIR /app

# 1. Crear package.json manual
RUN echo '{"dependencies":{}}' > package.json

# 2. Instalar dependencias UNA POR UNA (sin npm install global)
RUN npm init -y --silent
RUN npm install express@4.18.2 --save --silent --no-audit --no-fund
RUN npm install cors@2.8.5 --save --silent --no-audit --no-fund
RUN npm install multer@1.4.5-lts.1 --save --silent --no-audit --no-fund

# 3. Copiar server.js
COPY server.js .

# 4. Crear uploads
RUN mkdir -p uploads

# 5. Puerto
EXPOSE 5000

# 6. Comando
CMD ["node", "server.js"]