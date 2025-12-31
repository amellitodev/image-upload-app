import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
});

// Interceptor para errores
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.error || error.message || 'Error de conexión';
        throw new Error(message);
    }
);

export const getHealth = () => api.get('/api/health');

export const uploadImage = (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const uploadImages = (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/api/upload-multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const getImages = (): Promise<any[]> => api.get('/api/images');

export const deleteImage = (filename: string) => api.delete(`/api/image/${filename}`);

export default api;