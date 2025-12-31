import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Subidor de Imágenes | images.exatronclouds.com',
    description: 'Sube, gestiona y comparte tus imágenes fácilmente',
    keywords: ['imágenes', 'upload', 'compartir', 'galería'],
    authors: [{ name: 'Jose' }],
    openGraph: {
        type: 'website',
        url: 'https://images.exatronclouds.com',
        title: 'Subidor de Imágenes',
        description: 'Sube y gestiona tus imágenes fácilmente',
        siteName: 'Image Upload App',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                {children}
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 4000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}