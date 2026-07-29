// Enlaces de navegación compartidos entre SiteHeader y SiteFooter — antes vivían
// duplicados en cada componente; con i18n, mantener dos copias significa mantenerlas
// sincronizadas en dos idiomas. `key` referencia `common.nav.<key>` en el catálogo de
// mensajes (ver messages/es.json / en.json).
export const NAV_ITEMS = [
  { href: "#servicios", key: "services" },
  { href: "#proceso", key: "process" },
  { href: "#contacto", key: "contact" },
] as const;
