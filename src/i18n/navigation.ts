import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// ⚠ El `Link` que exporta esto es un Client Component (BaseLink.js tiene "use client"
// y llama a `useLocale()` de `use-intl` vía Context) — usarlo en cualquier parte del
// árbol exige envolver la app en `NextIntlClientProvider`. Mientras el proyecto
// mantenga cero componentes cliente (ver architecture.md §5), los enlaces a rutas
// reales se construyen a mano con `next/link` + `href={`/${locale}`}` (ver
// SiteHeader y LocaleSwitcher) usando el `useLocale()` server-side de "next-intl".
//
// Este módulo queda listo para el día que exista interactividad real (rutas más allá
// de "/", con `usePathname()`/`useRouter()` para preservar la ruta activa al cambiar
// de idioma) — en ese momento el componente que lo use pasa a "use client" y el costo
// de `NextIntlClientProvider` se paga junto con esa primera necesidad real.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
