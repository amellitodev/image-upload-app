'use client';

import ImageUploader from '@/components/ImageUploader';
import ImageGallery from '@/components/ImageGallery';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
    return (
        <div className="min-h-screen gradient-bg">
            <div className="container mx-auto px-4 py-8">
                <Header />
                
                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    <div className="glass-effect rounded-3xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-white">
                            📤 Subir Imágenes
                        </h2>
                        <ImageUploader />
                    </div>
                    
                    <div className="glass-effect rounded-3xl p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-white">
                            🖼️ Galería
                        </h2>
                        <ImageGallery />
                    </div>
                </main>
                
                <Footer />
            </div>
        </div>
    );
}