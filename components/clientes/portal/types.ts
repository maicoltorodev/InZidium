// ─── Types ────────────────────────────────────────────────────────────────────

export interface CatalogoItem {
  id: string;
  titulo: string;
  descripcion: string;
  precio: string;
  categoria: string;
  imagen: string;
  features: string[];
  /** Si es true, la card queda guardada en el admin pero no se muestra en el sitio. */
  disabled?: boolean;
}

export interface HoraItem {
  dia: string;
  horas: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

/** Cap visible al cliente en la sección Galería del portal. Mismo número
 * usado por el sanitizer del patch en `lib/onboarding-patch-schema.ts`. */
export const GALLERY_MAX_IMAGES = 10;

export type TipoCatalogo = "servicios" | "productos" | "menu";
export type Completion = "empty" | "partial" | "complete";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function newItem(): CatalogoItem {
  return {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    titulo: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen: "",
    features: [],
  };
}

export function newHora(): HoraItem {
  return { dia: "", horas: "" };
}

export function newGalleryImage(): GalleryImage {
  return {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    src: "",
    alt: "",
  };
}

export function getSectionCompletion(key: string, d: any): Completion {
  switch (key) {
    case "inicio": {
      // El dominio se gestiona por separado en el hub mobile; aqui solo cuentan
      // los campos de identidad visual.
      const n = [d.nombreComercial, d.slogan, d.logo].filter(Boolean).length;
      return n === 3 ? "complete" : n > 0 ? "partial" : "empty";
    }
    case "nosotros": {
      const n = [d.descripcion, d.mision, d.diferencial, d.imagenNosotros].filter(Boolean).length;
      return n >= 4 ? "complete" : n > 0 ? "partial" : "empty";
    }
    case "catalogo": {
      const items = (d.catalogo || []).length;
      return items > 0 ? "complete" : "empty";
    }
    case "contacto": {
      const hasHours = d.hours && Object.values(d.hours).some((v: any) => v);
      const n = [d.direccion, hasHours ? "ok" : ""].filter(Boolean).length;
      return n === 2 ? "complete" : n > 0 ? "partial" : "empty";
    }
    case "digital": {
      const n = [d.whatsapp, d.email].filter(Boolean).length;
      return n === 2 ? "complete" : n > 0 ? "partial" : "empty";
    }
    case "social": {
      const n = [d.instagram, d.facebook, d.tiktok, d.twitter, d.youtube, d.whatsappUrl, d.threads, d.telegram, d.waze].filter(Boolean).length;
      return n > 1 ? "complete" : n > 0 ? "partial" : "empty";
    }
    case "colores": {
      const primary = d.colorPrimario ?? d.colorAcento;
      const n = [d.colorFondo, primary, d.colorAcento2].filter(Boolean).length;
      return n === 3 ? "complete" : n > 0 ? "partial" : "empty";
    }
    case "legal": {
      const n = [d.legalTemplate, d.legalLastUpdated].filter(Boolean).length;
      return n === 2 ? "complete" : n > 0 ? "partial" : "empty";
    }
    case "galeria": {
      // Solo contamos completion si el toggle está activo. Si está apagado,
      // la sección no debería aparecer en el hub — pero por seguridad
      // devolvemos "empty" para que `nextSection` no apunte a ella.
      if (!d.galleryEnabled) return "empty";
      const n = Array.isArray(d.galleryImages) ? d.galleryImages.length : 0;
      if (n === 0) return "empty";
      // 3+ imágenes ya se ve sólido en grilla. Antes de eso queda "partial"
      // para empujar al cliente a llenar más.
      return n >= 3 ? "complete" : "partial";
    }
    default:
      return "empty";
  }
}
