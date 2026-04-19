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

/** Duración del countdown de construcción en horas. */
export const BUILD_DURATION_HOURS = 48;
