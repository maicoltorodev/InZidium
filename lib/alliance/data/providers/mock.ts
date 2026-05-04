import { IDataProvider } from "../interface";
import { Cliente, Proyecto, ChatMessage, Archivo } from "../types";

/**
 * 📦 MOCK PROVIDER: Datos en memoria para pruebas rápidas sin base de datos.
 * Esto permite validar la UI y la navegación de forma inmediata.
 */

// Datos Iniciales de Prueba
const MOCK_CLIENTES: Cliente[] = [
    { id: 'c1', nombre: 'Juan Pérez', cedula: '123456', email: 'juan@pro.com', telefono: '555-0101', createdAt: new Date() },
    { id: 'c2', nombre: 'María García', cedula: '654321', email: 'maria@web.com', telefono: '555-0202', createdAt: new Date() },
];

const MOCK_PROYECTOS: Proyecto[] = [
    {
        id: 'p1',
        clienteId: 'c1',
        nombre: 'Web Corporativa Alkubo',
        plan: 'Premium',
        fase: 'onboarding',
        buildStartedAt: null,
        link: 'www.alkubo.com',
        fechaInicio: new Date(),
        onboardingStep: 3,
        onboardingData: {},
        createdAt: new Date()
    },
];

export const MockProvider: IDataProvider = {
    clientes: {
        getAll: async () => MOCK_CLIENTES,
        getById: async (id) => MOCK_CLIENTES.find(c => c.id === id) || null,
        getByCedula: async (cedula) => MOCK_CLIENTES.find(c => c.cedula === cedula) || null,
        create: async (data) => {
            const nuevo = { ...data, id: `c${MOCK_CLIENTES.length + 1}`, createdAt: new Date() };
            MOCK_CLIENTES.push(nuevo);
            return { success: true };
        },
        update: async (id, data) => {
            const idx = MOCK_CLIENTES.findIndex(c => c.id === id);
            if (idx === -1) return { success: false, error: 'No encontrado' };
            MOCK_CLIENTES[idx] = { ...MOCK_CLIENTES[idx], ...data };
            return { success: true };
        },
        delete: async (id) => {
            const idx = MOCK_CLIENTES.findIndex(c => c.id === id);
            if (idx === -1) return { success: false, error: 'No encontrado' };
            MOCK_CLIENTES.splice(idx, 1);
            return { success: true };
        }
    },
    proyectos: {
        getAll: async () => MOCK_PROYECTOS.map(p => ({
            ...p,
            cliente: MOCK_CLIENTES.find(c => c.id === p.clienteId)
        })),
        getById: async (id) => MOCK_PROYECTOS.find(p => p.id === id) || null,
        getByClienteId: async (clienteId) => MOCK_PROYECTOS.filter(p => p.clienteId === clienteId),
        create: async (data: any) => {
            const nuevo = { ...data, id: `p${MOCK_PROYECTOS.length + 1}`, createdAt: new Date(), onboardingStep: 0, onboardingData: {} };
            MOCK_PROYECTOS.push(nuevo);
            return { success: true };
        },
        update: async (id, data) => {
            const idx = MOCK_PROYECTOS.findIndex(p => p.id === id);
            if (idx === -1) return { success: false, error: 'No encontrado' };
            MOCK_PROYECTOS[idx] = { ...MOCK_PROYECTOS[idx], ...data };
            return { success: true };
        },
        delete: async (id) => {
            const idx = MOCK_PROYECTOS.findIndex(p => p.id === id);
            if (idx === -1) return { success: false, error: 'No encontrado' };
            MOCK_PROYECTOS.splice(idx, 1);
            return { success: true };
        },
        atomicPatchOnboarding: async (id, patch) => {
            // Mock corre single-threaded en memoria — no hay race que proteger.
            // Equivalente semántico al drizzle provider.
            const idx = MOCK_PROYECTOS.findIndex(p => p.id === id);
            if (idx === -1) return { success: false as const, error: 'No encontrado' };
            const prev = { ...MOCK_PROYECTOS[idx] };
            const prevData = (prev.onboardingData as any) ?? {};
            const merged: Record<string, any> = { ...prevData, ...patch };
            if (Object.prototype.hasOwnProperty.call(patch, "dominioUno")) {
                merged.seoCanonicalUrl = patch.dominioUno
                    ? `https://www.${patch.dominioUno}.com`
                    : "";
            }
            MOCK_PROYECTOS[idx] = {
                ...MOCK_PROYECTOS[idx],
                onboardingData: merged,
                onboardingStep: 1,
            };
            return { success: true as const, prev, merged };
        },
    },
    chat: {
        addMessage: async (data: any) => {
            return { success: true };
        },
        getMessagesByProyectoId: async (proyectoId) => [],
        pruneMessages: async (proyectoId, keepCount) => ({ deletedImageUrls: [] }),
    },
    archivos: {
        add: async (data: any) => {
            return { success: true };
        },
        delete: async (id) => {
            return { success: true };
        },
        deleteByStoragePath: async (storagePath) => {
            return { success: true };
        },
        getAll: async () => []
    },
    getSystemStatus: async () => ({ database: 'ok (MOCK)', blob: 'ok (MOCK)', auth: 'ok (MOCK)' })
};
