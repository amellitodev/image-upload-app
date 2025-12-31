require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// ====================
// CONFIGURACIÓN
// ====================
const UPLOAD_DIR = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = (process.env.ALLOWED_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// ====================
// MIDDLEWARE
// ====================
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('combined'));
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Crear directorio de uploads si no existe
(async () => {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        console.log(`✅ Directorio creado: ${UPLOAD_DIR}`);
    }
})();

// ====================
// CONFIGURACIÓN MULTER
// ====================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Tipo de archivo no permitido. Permitidos: ${ALLOWED_MIME_TYPES.join(', ')}`), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
});

// ====================
// FUNCIONES UTILITARIAS
// ====================
const getImageUrl = (req, filename) => {
    if (process.env.NODE_ENV === 'production') {
        return `https://images.exatronclouds.com/uploads/${filename}`;
    }
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// ====================
// RUTAS
// ====================

// Servir archivos estáticos
app.use('/uploads', express.static(UPLOAD_DIR));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Image Upload API',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        uploadsDir: UPLOAD_DIR,
        domain: 'https://images.exatronclouds.com'
    });
});

// Subir una imagen
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
        }

        const fileInfo = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            url: getImageUrl(req, req.file.filename),
            uploadedAt: new Date().toISOString()
        };

        res.status(201).json({
            success: true,
            message: 'Imagen subida exitosamente',
            data: fileInfo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Subir múltiples imágenes
app.post('/api/upload-multiple', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron imágenes' });
        }

        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            url: getImageUrl(req, file.filename),
            uploadedAt: new Date().toISOString()
        }));

        res.status(201).json({
            success: true,
            message: `${uploadedFiles.length} imagen(es) subida(s) exitosamente`,
            count: uploadedFiles.length,
            data: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todas las imágenes
app.get('/api/images', async (req, res) => {
    try {
        const files = await fs.readdir(UPLOAD_DIR);
        
        const images = await Promise.all(
            files
                .filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file))
                .map(async (file) => {
                    const filePath = path.join(UPLOAD_DIR, file);
                    const stats = await fs.stat(filePath);
                    
                    return {
                        filename: file,
                        url: getImageUrl(req, file),
                        size: stats.size,
                        uploadedAt: stats.birthtime.toISOString(),
                        path: `/uploads/${file}`
                    };
                })
        );

        res.json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar imagen
app.delete('/api/image/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(UPLOAD_DIR, filename);

        // Validar que sea un archivo de imagen
        if (!/\.(jpe?g|png|gif|webp)$/i.test(filename)) {
            return res.status(400).json({ error: 'Archivo no válido' });
        }

        await fs.unlink(filePath);
        
        res.json({
            success: true,
            message: 'Imagen eliminada exitosamente'
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.status(404).json({ error: 'Imagen no encontrada' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// ====================
// MANEJO DE ERRORES
// ====================
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ 
                error: 'Archivo demasiado grande',
                maxSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`
            });
        }
        return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ 
        error: 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// Ruta no encontrada
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// ====================
// INICIAR SERVIDOR
// ====================
const startServer = async () => {
    try {
        // Verificar que el directorio de uploads existe
        await fs.access(UPLOAD_DIR).catch(async () => {
            await fs.mkdir(UPLOAD_DIR, { recursive: true });
        });

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`
            🚀 Servidor iniciado exitosamente!
            📡 Puerto: ${PORT}
            🌐 Entorno: ${process.env.NODE_ENV || 'development'}
            📁 Uploads: ${UPLOAD_DIR}
            🎯 Dominio: https://images.exatronclouds.com
            ⏰ Hora: ${new Date().toLocaleString()}
            `);
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();