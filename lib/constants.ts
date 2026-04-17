import { Zap, Pencil } from 'lucide-react';

export interface Plan {
    id: string;
    title: string;
    description: string;
    days: number | null;
    color: string;
    icon: any;
}

export const PLANS: Record<string, Plan> = {
    estandar: {
        id: "estandar",
        title: "Plan Estándar",
        description: "Entrega en 48 horas.",
        days: 2,
        color: "from-cyan-400 to-blue-600",
        icon: Zap
    },
    ala_medida: {
        id: "ala-medida",
        title: "A la medida",
        description: "Tiempo de desarrollo a convenir.",
        days: null,
        color: "from-[#FFD700] to-[#a855f7]",
        icon: Pencil
    }
};

// Export también como array para compatibilidad
export const PLANS_ARRAY: Plan[] = Object.values(PLANS);

export const PROJECT_STATUSES = {
    PENDIENTE: 'pendiente',
    DISENO: 'diseño',
    DESARROLLO: 'desarrollo',
    COMPLETADO: 'completado'
} as const;

export const getStatusFromProgress = (progress: number): string => {
    if (progress >= 100) return PROJECT_STATUSES.COMPLETADO;
    if (progress >= 50) return PROJECT_STATUSES.DESARROLLO;
    if (progress >= 20) return PROJECT_STATUSES.DISENO;
    return PROJECT_STATUSES.PENDIENTE;
};

export const getProgressFromStatus = (status: string): number => {
    switch (status) {
        case PROJECT_STATUSES.COMPLETADO: return 100;
        case PROJECT_STATUSES.DESARROLLO: return 75;
        case PROJECT_STATUSES.DISENO: return 35;
        case PROJECT_STATUSES.PENDIENTE: return 10;
        default: return 0;
    }
};

/** Duración del countdown de construcción en horas. */
export const BUILD_DURATION_HOURS = 48;

/** Label readable del sub-estado de construcción, derivado del porcentaje. */
export const getProgressLabel = (progress: number): string => {
    if (progress >= 100) return "Completado";
    if (progress >= 50) return "En desarrollo";
    if (progress >= 20) return "En diseño";
    return "Pendiente";
};
