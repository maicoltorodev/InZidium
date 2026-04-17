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
    nombre: "Alkubo Soluciones Gráficas",
    slug: "alkubo-estudio",
    dominio: "alkubosoluciones.com",
    email: "alkubosolucionesgraficas@gmail.com",
    telefono: "+57 322 7485563",
    whatsapp: "+57 322 7485563",
    direccion: "Calle 139 # 94 - 46 local 3",
    ciudad: "Bogotá",
    instagram: "@alkubo_solucionesgraficas",
    facebook: "alkubosolucionesgraficas",
    linkedin: "",
    nit: "",
    representante: "",
    moneda: "COP",
    simbolo: "$",
  },
  assets: {
    logoPath: "/images/logo.webp",
    logoPartnerPath: "/images/logo-inzidium.webp",
    faviconPath: "/icons/favicon.ico",
    ogImagePath: "/image-og.jpg",
  },
  partner: {
    nombre: "InZidium",
    porcentaje: 0.8,
    username: "InZidium",
    mostrarAlianza: true,
  },
  tech: {
    appUrl: "https://alkubosoluciones.com",
    apiUrl: "https://alkubosoluciones.com/api",
    authUrl: "https://alkubosoluciones.com",
    emailFrom: "alkubosolucionesgrafica@gmail.com",
    emailReplyTo: "alkubosolucionesgrafica@gmail.com",
    ntfyTopic: "alkubo-estudio-notificaciones",
    dbSchema: "alkubo_estudio",
    storageBucket: "alkubo-estudio-files",
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
