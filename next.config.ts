import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Ruta explícita al request config de next-intl: la resolución por defecto del plugin
// ha cambiado de ubicación entre versiones — ser explícito la vuelve irrelevante.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// La estrategia de hosting/renderizado sigue abierta — ver ia-docs/global/architecture.md §8.
// `images.unoptimized` evita que el sitio dependa de la optimización de imágenes en servidor,
// que no funciona con `output: 'export'`. Mantiene viva la opción de export estático mientras
// la decisión de hosting no se tome.
//
// `NEXT_OUTPUT=export` NO decide el hosting: es el interruptor que permite *verificar*
// en CI/local (`npm run build:export`) que la rama de export estático sigue viva.
const nextConfig: NextConfig = {
  ...(process.env.NEXT_OUTPUT === "export" ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
