'use client';

import { useState, useEffect } from 'react';
import { FiCopy, FiTrash2, FiEye, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getImages, deleteImage } from '@/lib/api';

interface Image {
    filename: string;
    url: string;
    size: number;
    uploadedAt: string;
}

export default function ImageGallery() {
    const [images, setImages] = useState<Image[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const data = await getImages();
            setImages(data);
        } catch (error) {
            toast.error('Error al cargar las imágenes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleDelete = async (filename: string) => {
        if (!confirm('¿Estás seguro de eliminar esta imagen?')) return;

        try {
            await deleteImage(filename);
            toast.success('Imagen eliminada');
            fetchImages();
        } catch (error) {
            toast.error('Error al eliminar la imagen');
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copiada al portapapeles');
    };

    const formatSize = (bytes: number) => {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="flex items-center justify-between">
                <div className="text-white">
                    <p className="text-sm opacity-70">Total de imágenes</p>
                    <p className="text-3xl font-bold">{images.length}</p>
                </div>
                <button
                    onClick={fetchImages}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                    Actualizar
                </button>
            </div>

            {/* Gallery */}
            {images.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                        <FiEye className="w-12 h-12 text-white/50" />
                    </div>
                    <p className="text-white/70">No hay imágenes subidas todavía</p>
                    <p className="text-sm text-white/50 mt-2">
                        Sube tu primera imagen usando el panel de la izquierda
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto scrollbar-hide p-2">
                    {images.map((image) => (
                        <div
                            key={image.filename}
                            className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors group"
                        >
                            {/* Image */}
                            <div 
                                className="h-48 relative overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(image)}
                            >
                                <img
                                    src={image.url}
                                    alt={image.filename}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <p className="text-sm text-white/70 truncate mb-2 font-mono">
                                    {image.filename}
                                </p>
                                
                                <div className="flex items-center justify-between text-sm text-white/60 mb-3">
                                    <span>{formatSize(image.size)}</span>
                                    <span>{formatDate(image.uploadedAt)}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => copyToClipboard(image.url)}
                                        className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        title="Copiar URL"
                                    >
                                        <FiCopy className="w-4 h-4" />
                                        <span className="text-sm">Copiar</span>
                                    </button>
                                    
                                    <a
                                        href={image.url}
                                        download={image.filename}
                                        className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        title="Descargar"
                                    >
                                        <FiDownload className="w-4 h-4" />
                                        <span className="text-sm">Descargar</span>
                                    </a>
                                    
                                    <button
                                        onClick={() => handleDelete(image.filename)}
                                        className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        title="Eliminar"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                        <span className="text-sm">Eliminar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal para vista previa */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div 
                        className="max-w-4xl max-h-[90vh] relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                        >
                            ✕ Cerrar
                        </button>
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.filename}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                        <div className="mt-4 text-white text-center">
                            <p className="font-mono">{selectedImage.filename}</p>
                            <p className="text-sm opacity-70">
                                {formatSize(selectedImage.size)} • {formatDate(selectedImage.uploadedAt)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}