import type { Locale } from "next-intl";
import type { ServiceLevel } from "../types/service-level";

// Fuente de datos local — ver ia-docs/global/architecture.md §4 y D5 (§7).
// Única frontera de la feature con el exterior. El día que exista FastAPI,
// `getServiceLevels` pasa a hacer `fetch(`${API}/service-levels?lang=${locale}`)` y el
// resto de la feature (componentes, tipos) no cambia: la forma de este objeto ES la
// forma del payload esperado.
//
// Los rangos de precio existen en el catálogo fuente pero se excluyen deliberadamente
// de este listado: la landing no muestra precios (decisión de producto, §6).
//
// `id`/`level`/`popular` quedan duplicados entre los dos arrays de locale a propósito:
// esta forma es 1:1 con el payload esperado de la futura API, así que el swap
// mock→HTTP es una eliminación pura, no una reestructuración.
const SERVICE_LEVELS: Record<Locale, ServiceLevel[]> = {
  es: [
    {
      id: "landing-page",
      level: 1,
      name: "Landing Page",
      description: "Página única de alto impacto diseñada para convertir visitantes en clientes.",
      deliveryTime: { min: 1, max: 2, unit: "weeks" },
    },
    {
      id: "sitio-informativo",
      level: 2,
      name: "Sitio Informativo / Corporativo",
      description: "Sitio de múltiples páginas que presenta tu empresa de forma profesional.",
      deliveryTime: { min: 3, max: 5, unit: "weeks" },
    },
    {
      id: "sitio-con-login",
      level: 3,
      name: "Sitio con Login / Área de Usuarios",
      description:
        "Plataforma web con autenticación de usuarios, roles y acceso a contenido o funciones exclusivas.",
      deliveryTime: { min: 5, max: 10, unit: "weeks" },
    },
    {
      id: "tienda-en-linea",
      level: 4,
      name: "Tienda en Línea",
      description:
        "Tienda virtual completa con catálogo de productos, carrito de compras, pasarela de pago y gestión de pedidos.",
      deliveryTime: { min: 6, max: 12, unit: "weeks" },
    },
    {
      id: "portal-a-medida",
      level: 5,
      name: "Portal / Sistema a Medida",
      description:
        "Desarrollo de software web completamente personalizado con integraciones complejas y arquitectura escalable para empresas en crecimiento.",
      deliveryTime: { min: 3, max: 9, unit: "months" },
    },
  ],
  en: [
    {
      id: "landing-page",
      level: 1,
      name: "Landing Page",
      description: "A single high-impact page designed to convert visitors into customers.",
      deliveryTime: { min: 1, max: 2, unit: "weeks" },
    },
    {
      id: "sitio-informativo",
      level: 2,
      name: "Informational / Corporate Website",
      description: "A multi-page site that presents your company professionally.",
      deliveryTime: { min: 3, max: 5, unit: "weeks" },
    },
    {
      id: "sitio-con-login",
      level: 3,
      name: "Website with Login / User Area",
      description:
        "A web platform with user authentication, roles, and access to exclusive content or features.",
      deliveryTime: { min: 5, max: 10, unit: "weeks" },
    },
    {
      id: "tienda-en-linea",
      level: 4,
      name: "Online Store",
      description:
        "A complete online store with product catalog, shopping cart, payment gateway, and order management.",
      deliveryTime: { min: 6, max: 12, unit: "weeks" },
    },
    {
      id: "portal-a-medida",
      level: 5,
      name: "Custom Portal / System",
      description:
        "Fully custom web software development with complex integrations and scalable architecture for growing businesses.",
      deliveryTime: { min: 3, max: 9, unit: "months" },
    },
  ],
};

export async function getServiceLevels(locale: Locale): Promise<ServiceLevel[]> {
  return SERVICE_LEVELS[locale];
}
