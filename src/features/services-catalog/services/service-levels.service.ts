import type { ServiceLevel } from "../types/service-level";

// Fuente de datos local — ver ia-docs/global/architecture.md §4.
// Este archivo es la única frontera de la feature con el exterior: el día que exista
// el backend en FastAPI, `getServiceLevels` pasa a hacer `fetch` contra la API y el
// resto de la feature (componentes, tipos) no cambia.
//
// Los rangos de precio existen en el catálogo fuente pero se excluyen deliberadamente
// de este listado: la landing no muestra precios (decisión de producto).
const SERVICE_LEVELS: ServiceLevel[] = [
  {
    id: "landing-page",
    level: 1,
    name: "Landing Page",
    description:
      "Página única de alto impacto diseñada para convertir visitantes en clientes. Ideal para promocionar un producto, servicio o evento específico.",
    deliveryTime: "1 – 2 semanas",
  },
  {
    id: "sitio-informativo",
    level: 2,
    name: "Sitio Informativo / Corporativo",
    description:
      "Sitio de múltiples páginas que presenta tu empresa de forma profesional. Perfecto para negocios establecidos que necesitan proyectar confianza.",
    deliveryTime: "3 – 5 semanas",
    popular: true,
  },
  {
    id: "sitio-con-login",
    level: 3,
    name: "Sitio con Login / Área de Usuarios",
    description:
      "Plataforma web con autenticación de usuarios, roles y acceso a contenido o funciones exclusivas.",
    deliveryTime: "5 – 10 semanas",
  },
  {
    id: "tienda-en-linea",
    level: 4,
    name: "Tienda en Línea",
    description:
      "Tienda virtual completa con catálogo de productos, carrito de compras, pasarela de pago y gestión de pedidos.",
    deliveryTime: "6 – 12 semanas",
  },
  {
    id: "portal-a-medida",
    level: 5,
    name: "Portal / Sistema a Medida",
    description:
      "Desarrollo de software web completamente personalizado con integraciones complejas y arquitectura escalable para empresas en crecimiento.",
    deliveryTime: "3 – 9 meses",
  },
];

export async function getServiceLevels(): Promise<ServiceLevel[]> {
  return SERVICE_LEVELS;
}
