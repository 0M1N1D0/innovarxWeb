import type { NextConfig } from "next";

// La estrategia de hosting/renderizado sigue abierta — ver ia-docs/global/architecture.md §8.
// `images.unoptimized` evita que el sitio dependa de la optimización de imágenes en servidor,
// que no funciona con `output: 'export'`. Mantiene viva la opción de export estático mientras
// la decisión de hosting no se tome.
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
