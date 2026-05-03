/**
 * STUDIO CONFIG — fuente única de datos del estudio actual.
 *
 * Este archivo es el equivalente al `business-input` de `plantilla/`:
 * solo contiene conexiones, información textual, paths de assets y config
 * técnica. NO contiene decisiones de diseño (colores, tipografías, spacing) —
 * esas viven directo en código (globals.css, tailwind.config, componentes).
 *
 * Para rebrandear a un estudio nuevo: editar este archivo + reemplazar los
 * archivos físicos en `public/` referenciados por `STUDIO.assets`.
 */

export interface StudioConfig {
  studio: {
    nombre: string;
    slug: string;
    dominio: string;
    email: string;
    telefono: string;
    whatsapp: string;
    direccion: string;
    ciudad: string;
    instagram: string;
    facebook: string;
    linkedin: string;
    nit: string;
    representante: string;
    moneda: string;
    simbolo: string;
  };
  assets: {
    logoPath: string;
    logoPartnerPath: string;
    faviconPath: string;
    ogImagePath: string;
  };
  partner: {
    nombre: string;
    porcentaje: number;
    username: string;
    mostrarAlianza: boolean;
  };
  tech: {
    appUrl: string;
    apiUrl: string;
    authUrl: string;
    emailFrom: string;
    emailReplyTo: string;
    ntfyTopic: string;
    dbSchema: string;
    storageBucket: string;
  };
}

export const STUDIO: StudioConfig = {
  studio: {
    nombre: "InZidium",
    slug: "inzidium",
    dominio: "inzidium.com",
    email: "maicoltorodev@gmail.com",
    telefono: "+57 320 248 3740",
    whatsapp: "+57 320 248 3740",
    direccion: "",
    ciudad: "Bogotá",
    instagram: "",
    facebook: "",
    linkedin: "",
    nit: "",
    representante: "Maicol Stiven Toro Aguirre",
    moneda: "COP",
    simbolo: "$",
  },
  assets: {
    logoPath: "/logo.webp",
    logoPartnerPath: "",
    faviconPath: "/favicon.ico",
    ogImagePath: "/image-og.jpg",
  },
  partner: {
    nombre: "",
    porcentaje: 0,
    username: "",
    mostrarAlianza: false,
  },
  tech: {
    appUrl: "https://inzidium.com",
    apiUrl: "https://inzidium.com/api",
    authUrl: "https://inzidium.com",
    emailFrom: "maicoltorodev@gmail.com",
    emailReplyTo: "maicoltorodev@gmail.com",
    ntfyTopic: "inzidium-notificaciones",
    dbSchema: "public",
    storageBucket: "inzidium-files",
  },
};

/** @deprecated Usar `STUDIO.studio` directamente. */
export const ESTUDIO_CONFIG = STUDIO.studio;

/** @deprecated Usar `STUDIO.tech` directamente. */
export const TECH_CONFIG = STUDIO.tech;

export const getEstudioUrl = (path: string = "") =>
  `${STUDIO.tech.appUrl}${path}`;

export const getApiUrl = (endpoint: string) =>
  `${STUDIO.tech.apiUrl}${endpoint}`;

export const formatCurrency = (amount: number) =>
  `${STUDIO.studio.simbolo}${amount.toLocaleString()}`;

export const getContactInfo = () => ({
  email: STUDIO.studio.email,
  telefono: STUDIO.studio.telefono,
  whatsapp: STUDIO.studio.whatsapp,
  direccion: STUDIO.studio.direccion,
});
