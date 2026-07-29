import type { ReactNode } from "react";
import { routing } from "@/i18n/routing";

// Root layout #1 (ver ia-docs/global/architecture.md §6). Existe solo para que "/" sea
// un documento HTML completo y estático que rebota a /es. NO carga fuentes ni
// globals.css: es un shim que nunca se ve. Un `redirect()` de next/navigation no
// sirve aquí porque no produce HTML y `output: 'export'` no puede exportarlo
// (architecture.md §8).
export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0; url=/${routing.defaultLocale}`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
