import {
  Zap, Users, ShoppingBag, MapPin, Mail, AtSign, Palette,
  MessageSquare, Lock, SlidersHorizontal, Settings2,
} from "lucide-react";

export type SectionKey =
  | "inicio" | "nosotros" | "catalogo" | "contacto" | "digital"
  | "social" | "colores" | "legal" | "avanzado" | "chat" | "ajustes";

export type SectionMeta = {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  /** Anchors para subnav en DesktopSection. Se muestran solo si la lista no está vacía. */
  subnav?: { id: string; label: string }[];
};

export const SECTION_REGISTRY: Record<SectionKey, SectionMeta> = {
  inicio: {
    icon: Zap,
    title: "Inicio",
    subtitle: "Nombre, slogan y logo: lo primero que verán tus visitantes.",
  },
  nosotros: {
    icon: Users,
    title: "Nosotros",
    subtitle: "Cuéntale a tus clientes quiénes son y qué los hace especiales.",
    subnav: [
      { id: "nosotros-descripcion", label: "Descripción" },
      { id: "nosotros-mision",      label: "Misión" },
      { id: "nosotros-diferencial", label: "Diferencial" },
      { id: "nosotros-foto",        label: "Foto" },
      { id: "nosotros-stats",       label: "Datos clave" },
    ],
  },
  catalogo: {
    icon: ShoppingBag,
    title: "Catálogo",
    subtitle: "Agrega los ítems de tu catálogo.",
  },
  contacto: {
    icon: MapPin,
    title: "Ubicación",
    subtitle: "Dónde encontrarte y cuándo visitarte.",
    subnav: [
      { id: "ubicacion-descripcion", label: "Descripción del local" },
      { id: "ubicacion-direccion",   label: "Dirección" },
      { id: "ubicacion-horarios",    label: "Horarios" },
      { id: "ubicacion-mapa",        label: "Enlace de mapa" },
    ],
  },
  digital: {
    icon: Mail,
    title: "Contacto",
    subtitle: "Información que aparece en el pie de página y en el botón de WhatsApp.",
    subnav: [
      { id: "contacto-whatsapp", label: "WhatsApp" },
      { id: "contacto-telefono", label: "Teléfono" },
      { id: "contacto-email",    label: "Correo" },
      { id: "contacto-footer",   label: "Texto de cierre" },
      { id: "contacto-fab",      label: "Botón flotante" },
    ],
  },
  social: {
    icon: AtSign,
    title: "Redes sociales",
    subtitle: "Deja vacío lo que no uses.",
  },
  colores: {
    icon: Palette,
    title: "Colores",
    subtitle: "Define la paleta visual de tu sitio.",
  },
  legal: {
    icon: Lock,
    title: "Legal",
    subtitle: "Términos y privacidad — se generan según tu rubro.",
  },
  avanzado: {
    icon: SlidersHorizontal,
    title: "Ajustes",
    subtitle: "Tipografía, SEO y analíticas.",
  },
  chat: {
    icon: MessageSquare,
    title: "Mensajes",
    subtitle: "Comunicación directa con el equipo de desarrollo.",
  },
  ajustes: {
    icon: Settings2,
    title: "Ajustes avanzados",
    subtitle: "Configuraciones secundarias que puedes dejar para el final.",
  },
};

export function getCatalogoSubtitle(tipoCatalogo?: string): string {
  if (tipoCatalogo === "productos") return "Productos de tu tienda";
  if (tipoCatalogo === "menu") return "Platillos de tu menú";
  return "Servicios que ofreces";
}

/** Listado de secciones scoreables en el hub (en orden). */
export const HUB_SECTIONS: { key: SectionKey; icon: React.ElementType; label: string; subtitle: string }[] = [
  { key: "inicio",   icon: Zap,         label: "Inicio",         subtitle: "Nombre, slogan y logo" },
  { key: "nosotros", icon: Users,       label: "Nosotros",       subtitle: "Historia, misión y diferencial" },
  { key: "catalogo", icon: ShoppingBag, label: "Catálogo",       subtitle: "Ítems de tu catálogo" },
  { key: "contacto", icon: MapPin,      label: "Ubicación",      subtitle: "Dirección y horarios" },
  { key: "digital",  icon: Mail,        label: "Contacto",       subtitle: "WhatsApp, email y teléfono" },
  { key: "social",   icon: AtSign,      label: "Redes sociales", subtitle: "Instagram, TikTok y más" },
  { key: "colores",  icon: Palette,     label: "Colores",        subtitle: "Paleta visual de tu sitio" },
];
