'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { uploadImages } from '@/lib/api';

export default function ImageUploader() {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        toast.success(`${acceptedFiles.length} archivo(s) agregado(s)`);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error('Selecciona al menos una imagen');
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            await uploadImages(files);

            clearInterval(interval);
            setProgress(100);
            
            toast.success(`¡${files.length} imagen(es) subida(s) exitosamente!`);
            setFiles([]);
            
            setTimeout(() => setProgress(0), 1000);
        } catch (error: any) {
            toast.error(error.message || 'Error al subir las imágenes');
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`
                    border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer
                    transition-all duration-300 ease-in-out
                    ${isDragActive 
                        ? 'border-blue-400 bg-blue-50/20' 
                        : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                    }
                `}
            >
                <input {...getInputProps()} />
                <FiUpload className="w-16 h-16 mx-auto mb-4 text-white/70" />
                <p className="text-lg font-medium text-white mb-2">
                    {isDragActive 
                        ? '¡Suelta las imágenes aquí!' 
                        : 'Arrastra y suelta imágenes aquí'
                    }
                </p>
                <p className="text-white/60">o haz clic para seleccionar</p>
                <p className="text-sm text-white/50 mt-2">
                    Soporta: JPEG, PNG, GIF, WebP • Máx. 10MB por imagen
                </p>
            </div>

            {/* Selected files */}
            {files.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-white">
                            Archivos seleccionados ({files.length})
                        </h3>
                        <button
                            onClick={() => setFiles([])}
                            className="text-sm text-red-400 hover:text-red-300"
                        >
                            Limpiar todos
                        </button>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                        {files.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between bg-white/10 rounded-lg p-3"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                                        <span className="text-xs font-bold">
                                            {file.type.split('/')[1]?.toUpperCase() || 'IMG'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white truncate max-w-xs">
                                            {file.name}
                                        </p>
                                        <p className="text-sm text-white/60">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-1 hover:bg-white/10 rounded"
                                >
                                    <FiX className="w-5 h-5 text-red-400" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload button with progress */}
            <div className="relative">
                <button
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                    className={`
                        w-full py-4 rounded-xl font-bold text-lg transition-all
                        relative overflow-hidden
                        ${uploading || files.length === 0
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                        }
                    `}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Subiendo... {progress}%
                            </>
                        ) : (
                            <>
                                <FiUpload />
                                Subir {files.length} Imagen(es)
                            </>
                        )}
                    </span>
                    
                    {/* Progress bar */}
                    {uploading && (
                        <div
                            className="absolute bottom-0 left-0 h-1 bg-green-400 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    )}
                </button>
            </div>

            {/* Status */}
            {uploading && (
                <div className="text-center">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-sm text-white/70 mt-2">
                        {progress < 100 ? 'Subiendo imágenes...' : '¡Completado!'}
                    </p>
                </div>
            )}
        </div>
    );
}