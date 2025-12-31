# Image Upload App

Proyecto fullstack con frontend en Next.js y backend en Express para subir y servir imágenes.

Rutas principales (backend):
- `GET /api/health` — salud
- `POST /api/upload` — subir 1 imagen (field: `image`)
- `POST /api/upload-multiple` — subir múltiples (field: `images`)
- `GET /api/images` — listar imágenes
- `DELETE /api/image/:filename` — eliminar imagen
- `GET /uploads/:filename` — servir imagen

Variables de entorno

- Backend (`backend/.env`):
  - `PORT` (por defecto 5000)
  - `BASE_URL` (opcional, p. ej. https://images.tudominio.com)
  - `FRONTEND_URL` (opcional para CORS)
  - `MAX_FILE_SIZE` (bytes)

- Frontend (`frontend/.env.local`):
  - `NEXT_PUBLIC_API_URL` (URL pública del backend, p. ej. https://images.tudominio.com)

Desarrollo local

1. Backend

```bash
cd backend
npm install
npm run dev
```

Esto arranca el backend en `http://localhost:5000`.

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acceder a `http://localhost:3000`.

Despliegue con Dokploy (resumen)

1. Dokploy detecta el repositorio y construye/lanza la imagen al hacer `git push`.
2. Configura en Dokploy las siguientes variables de entorno:
   - Backend: `PORT`, `BASE_URL` (p. ej. https://images.tudominio.com), `FRONTEND_URL` (tu frontend público)
   - Frontend: `NEXT_PUBLIC_API_URL` apuntando a la URL pública del backend
3. Dokploy puede construir usando el `Dockerfile` en cada carpeta. Asegúrate de que Dokploy esté configurado para construir ambos servicios o usa `docker-compose.yml` si prefieres.

Notas de seguridad y producción

- Usa un bucket S3 u otro almacenamiento externo si esperas mucho tráfico o necesitas redundancia.
- Escanea uploads en producción si es necesario.
- No expongas `.env` ni `uploads` en el repositorio.
