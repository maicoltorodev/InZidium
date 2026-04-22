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
    default:
      return "empty";
  }
}
