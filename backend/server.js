const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware básico
app.use(require("cors")());
app.use(express.json());

// Ruta de salud
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "Image Upload API is running",
        timestamp: new Date().toISOString()
    });
});

// Ruta de prueba de subida
app.get("/", (req, res) => {
    res.json({
        service: "Image Upload API",
        version: "1.0",
        endpoints: ["/api/health", "/api/upload", "/api/images"]
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(` Server running on port ${PORT}`);
});
