/**
 * 🧱 TIPOS DE DOMINIO: Alkubo
 * Estos tipos representan las entidades de negocio de forma pura,
 * permitiendo que la UI sea independiente de la base de datos.
 */

/** Fase cliente-facing del ciclo de vida del proyecto. */
export type ProjectFase = 'onboarding' | 'construccion' | 'publicado';

export interface Cliente {
    id: string;
    nombre: string;
    cedula: string;
    email: string;
    telefono?: string | null;
    activeSessionId?: string | null;
    createdAt: Date;
}

export interface Proyecto {
    id: string;
    clienteId: string;
    nombre: string;
    plan: string;
    fase: ProjectFase;
    buildStartedAt?: Date | null;
    link?: string | null;
    fechaInicio: Date;
    fechaEntrega?: Date | null;
    onboardingStep: number;
    onboardingData: Record<string, any>;
    createdAt: Date;
    
    // Relaciones (opcionales según la consulta)
    cliente?: Cliente;
    archivos?: Archivo[];
    chat?: ChatMessage[];
}

export interface Archivo {
    id: string;
    proyectoId: string;
    url: string;
    storagePath?: string | null;
    nombre: string;
    tipo?: string | null;
    tamano?: number | null;
    subidoPor: 'admin' | 'cliente';
    createdAt: Date;
}

export interface ChatMessage {
    id: string;
    proyectoId: string;
    contenido: string;
    imagenes: string[];
    autor: 'cliente' | 'admin';
    leido: boolean;
    createdAt: Date;
}

export interface AdminUser {
    id: string;
    nombre: string;
    username: string;
    passwordHash?: string; // Solo se usa internamente para Auth
    activeSessionId?: string | null; // ID de sesión activa para sesión única
    createdAt: Date;
}
