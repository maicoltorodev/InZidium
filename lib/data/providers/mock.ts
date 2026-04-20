import { IDataProvider } from "../interface";
import { Cliente, Proyecto, AdminUser, ChatMessage, Archivo } from "../types";
import bcrypt from "bcryptjs";

const MOCK_ADMIN_PASSWORD_HASH = bcrypt.hashSync("admin123", 10);

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

const MOCK_ADMINS: AdminUser[] = [
    { id: 'a1', nombre: 'Admin Alkubo', username: 'admin', createdAt: new Date() },
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
        }
    },
    auth: {
        getUserByUsername: async (username) => {
            if (username === 'admin') return { ...MOCK_ADMINS[0], passwordHash: MOCK_ADMIN_PASSWORD_HASH };
            return null;
        },
        getUserById: async (id) => {
            return MOCK_ADMINS.find(a => a.id === id) || null;
        },
        updateSessionId: async (id, sessionId) => {
            const admin = MOCK_ADMINS.find(a => a.id === id);
            if (admin) (admin as any).activeSessionId = sessionId;
        },
        getAllAdmins: async () => MOCK_ADMINS,
        createAdmin: async (data: any) => {
            MOCK_ADMINS.push({ ...data, id: 'a' + Date.now(), createdAt: new Date() });
            return { success: true };
        },
        deleteAdmin: async (id) => {
            const idx = MOCK_ADMINS.findIndex(a => a.id === id);
            if (idx !== -1) MOCK_ADMINS.splice(idx, 1);
            return { success: true };
        }
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
