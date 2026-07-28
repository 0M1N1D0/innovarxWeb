# InnovArx — Sitio web

Sitio web de **InnovArx**, empresa de desarrollo de software. Presenta los servicios de desarrollo web que ofrece la empresa (de landing page a plataforma completa), el proceso de trabajo y un canal de contacto para cotizar proyectos.

Hoy el proyecto es un frontend puro construido con Next.js. No hay backend propio: los datos que muestra el sitio viven localmente en el código. Cuando el proyecto necesite backend real (formularios con persistencia, autenticación, panel de administración), se construye como servicio separado en FastAPI — ver [`ia-docs/global/architecture.md`](./ia-docs/global/architecture.md) §2.

## Documentación

Antes de tocar código, revisar las tres fuentes de verdad del proyecto — cualquier decisión de tecnología, estructura o diseño visual sale de ahí, no se improvisa en el código:

| Documento | Responde |
|---|---|
| [`ia-docs/global/architecture.md`](./ia-docs/global/architecture.md) | Dónde vive cada cosa y por qué — límites del sistema, organización por feature, flujo de datos, rutas |
| [`ia-docs/global/tech-stack.md`](./ia-docs/global/tech-stack.md) | Con qué se construye — stack, TypeScript, tooling, convenciones de nombres |
| [`ia-docs/global/styles.md`](./ia-docs/global/styles.md) | Identidad visual — color, tipografía, espaciado, tokens listos para usar |

## Requisitos

- Node.js 24+
- npm (gestor de paquetes del proyecto — no usar pnpm ni yarn)

## Cómo ejecutar el proyecto

```bash
npm install       # instalar dependencias
npm run dev       # levantar el servidor de desarrollo → http://localhost:3000
```

Otros comandos disponibles:

```bash
npm run build      # build de producción
npm run start      # servir el build de producción (después de `npm run build`)
npm run lint       # ESLint
npm run format     # formatear el proyecto con Prettier
```

## Estructura del proyecto

Organización por feature — cada feature es autocontenida y expone su superficie pública en un único `index.ts`. El detalle completo y el porqué de cada regla están en `architecture.md` §3.

```
src/
  app/                         # solo rutas y layouts; ensambla features
  features/
    landing/                   # hero, proceso, CTA final
    services-catalog/          # niveles de servicio (sin precios — ver architecture.md §6)
  shared/
    components/                # Button, Section, SiteHeader, SiteFooter
  styles/
    tokens.css                 # tokens de diseño (styles.md §7.2)
    globals.css
```

## Estado actual

- Implementada: la ruta `/` (landing), con las features `landing` y `services-catalog`.
- Pendientes: rutas `/servicios` y `/contacto` como páginas propias. Ver la tabla de rutas en `architecture.md` §6 para el estado de cada una.
- El footer y la sección de contacto llevan marcadores `[correo de contacto pendiente]` / `[teléfono pendiente]` — deliberadamente sin datos reales hasta que se definan.
- La landing no muestra precios: es una decisión de producto, documentada en `architecture.md` §6.
