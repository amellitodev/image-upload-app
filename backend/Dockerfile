FROM node:18-alpine

WORKDIR /app

# 1. Copiar package.json si existe, si no crearlo
COPY package.json . 2>/dev/null || echo "Creating package.json..." && echo '{"dependencies":{"express":"^4.18.2","cors":"^2.8.5","multer":"^1.4.5-lts.1"}}' > package.json

# 2. Instalar dependencias
RUN npm install --omit=dev --no-audit --no-fund

# 3. Copiar el resto
COPY . .

# 4. Crear carpeta uploads
RUN mkdir -p uploads

# 5. Variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]