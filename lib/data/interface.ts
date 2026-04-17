import { 
    Cliente, 
    Proyecto, 
    AdminUser, 
    Archivo, 
    ChatMessage 
} from "./types";

export interface IDataProvider {
    // 👥 Clientes
    clientes: {
        getAll(): Promise<Cliente[]>;
        getById(id: string): Promise<Cliente | null>;
        getByCedula(cedula: string): Promise<Cliente | null>;
        create(data: Omit<Cliente, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }>;
        update(id: string, data: Partial<Cliente>): Promise<{ success: boolean; error?: string }>;
        delete(id: string): Promise<{ success: boolean; error?: string }>;
    };

    // 🚀 Proyectos
    proyectos: {
        getAll(): Promise<Proyecto[]>;
        getById(id: string): Promise<Proyecto | null>;
        getByClienteId(clienteId: string): Promise<Proyecto[]>;
        create(data: Omit<Proyecto, 'id' | 'createdAt' | 'fechaInicio' | 'onboardingStep' | 'onboardingData' | 'progreso' | 'estado' | 'visibilidad'>): Promise<{ success: boolean; error?: string }>;
        update(id: string, data: Partial<Proyecto>): Promise<{ success: boolean; error?: string }>;
        delete(id: string): Promise<{ success: boolean; error?: string }>;
    };

    // 🛡️ Auth / Admins
    auth: {
        getUserByUsername(username: string): Promise<AdminUser | null>;
        getUserById(id: string): Promise<AdminUser | null>;
        updateSessionId(id: string, sessionId: string | null): Promise<void>;
        getAllAdmins(): Promise<AdminUser[]>;
        createAdmin(data: Omit<AdminUser, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }>;
        deleteAdmin(id: string): Promise<{ success: boolean; error?: string }>;
    };

    // 💬 Chat
    chat: {
        addMessage(data: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }>;
        getMessagesByProyectoId(proyectoId: string): Promise<ChatMessage[]>;
        pruneMessages(proyectoId: string, keepCount: number): Promise<{ deletedImageUrls: string[] }>;
    };

    // 📁 Archivos (Metadatos)
    archivos: {
        add(data: Omit<Archivo, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }>;
        delete(id: string): Promise<{ success: boolean; storagePath?: string | null; error?: string }>;
        getAll(): Promise<Archivo[]>;
    };

    // 🚦 Health
    getSystemStatus(): Promise<{ database: string; blob: string; auth: string }>;
}
