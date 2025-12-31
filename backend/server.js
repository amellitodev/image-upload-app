require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar path para módulos globales
if (process.env.NODE_PATH) {
    require('module').Module._nodeModulePaths = function(from) {
        const paths = [];
        paths.push(process.env.NODE_PATH);
        return paths;
    };
}

const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });




// Middleware
app.use(helmet());
app.use(morgan('tiny'));
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(UPLOAD_DIR, { dotfiles: 'deny', maxAge: '30d' }));

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const basename = Date.now() + '-' + Math.floor(Math.random() * 1e9);
        cb(null, basename + ext);
    }
});

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const fileFilter = (req, file, cb) => {
    if (imageMimeTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only images are allowed.'), false);
};

const upload = multer({
    storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || String(10 * 1024 * 1024), 10) },
    fileFilter
});

// Helpers
const getBaseUrl = (req) => process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

// Health
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Image Upload API is running', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.json({ service: 'Image Upload API', version: '1.0', endpoints: ['/api/health', '/api/upload', '/api/images'] });
});

// Upload single
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const base = getBaseUrl(req);
    res.json({
        filename: req.file.filename,
        url: `${base}/uploads/${req.file.filename}`,
        size: req.file.size,
        mime: req.file.mimetype,
        uploadedAt: new Date().toISOString()
    });
});

// Upload multiple
app.post('/api/upload-multiple', upload.array('images', 20), (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
    const base = getBaseUrl(req);
    const files = req.files.map(f => ({
        filename: f.filename,
        url: `${base}/uploads/${f.filename}`,
        size: f.size,
        mime: f.mimetype
    }));
    res.json(files);
});

// List images
app.get('/api/images', (req, res) => {
    try {
        const files = fs.readdirSync(UPLOAD_DIR).filter(f => f[0] !== '.');
        const base = getBaseUrl(req);
        const data = files.map(filename => {
            const filePath = path.join(UPLOAD_DIR, filename);
            const stat = fs.statSync(filePath);
            return {
                filename,
                url: `${base}/uploads/${filename}`,
                size: stat.size,
                uploadedAt: stat.birthtime.toISOString()
            };
        }).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Unable to list images' });
    }
});

// Delete image
app.delete('/api/image/:filename', (req, res) => {
    try {
        const filename = path.basename(req.params.filename);
        const filePath = path.join(UPLOAD_DIR, filename);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
        fs.unlinkSync(filePath);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Unable to delete file' });
    }
});

// Error handlers
app.use((err, req, res, next) => {
    if (err && err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large' });
    if (err && err.message) return res.status(400).json({ error: err.message });
    next(err);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
