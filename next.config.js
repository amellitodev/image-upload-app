/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.exatronclouds.com',
                pathname: '/uploads/**',
            },
        ],
        unoptimized: true, // Para imágenes subidas por usuarios
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
};

module.exports = nextConfig;