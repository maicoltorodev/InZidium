import { pgTable, text, varchar, timestamp, integer, uuid, boolean, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const estudios = pgTable("estudios", {
    id: uuid("id").defaultRandom().primaryKey(),
    nombre: text("nombre").notNull(),
    slug: text("slug").notNull().unique(),
    dominio: text("dominio").unique(),
    activo: boolean("activo").default(true),
    logoUrl: text("logo_url"),
    config: json("config").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const administradores = pgTable("administradores", {
    id: uuid("id").defaultRandom().primaryKey(),
    estudioId: uuid("estudio_id").references(() => estudios.id, { onDelete: "cascade" }).notNull(),
    nombre: text("nombre").notNull(),
    username: text("username").notNull(),
    passwordHash: text("password_hash").notNull(),
    activeSessionId: text("active_session_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clientes = pgTable("clientes", {
    id: uuid("id").defaultRandom().primaryKey(),
    estudioId: uuid("estudio_id").references(() => estudios.id, { onDelete: "cascade" }).notNull(),
    nombre: text("nombre").notNull(),
    cedula: varchar("cedula", { length: 20 }).notNull(),
    email: text("email").notNull(),
    telefono: varchar("telefono", { length: 20 }),
    activeSessionId: text("active_session_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const proyectos = pgTable("proyectos", {
    id: uuid("id").defaultRandom().primaryKey(),
    estudioId: uuid("estudio_id").references(() => estudios.id, { onDelete: "cascade" }).notNull(),
    clienteId: uuid("cliente_id").references(() => clientes.id, { onDelete: "cascade" }).notNull(),
    nombre: text("nombre").notNull(),
    plan: varchar("plan", { length: 50 }).notNull(),
    fase: varchar("fase", { length: 20 }).default("onboarding").notNull(),
    buildStartedAt: timestamp("build_started_at"),
    freezeMode: boolean("freeze_mode").default(false).notNull(),
    link: varchar("link", { length: 255 }),
    fechaInicio: timestamp("fecha_inicio").defaultNow().notNull(),
    fechaEntrega: timestamp("fecha_entrega"),
    onboardingStep: integer("onboarding_step").default(0).notNull(),
    onboardingData: json("onboarding_data").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const archivos = pgTable("archivos", {
    id: uuid("id").defaultRandom().primaryKey(),
    estudioId: uuid("estudio_id").references(() => estudios.id, { onDelete: "cascade" }).notNull(),
    proyectoId: uuid("proyecto_id").references(() => proyectos.id, { onDelete: "cascade" }).notNull(),
    url: text("url").notNull(),
    storagePath: text("storage_path"),
    nombre: text("nombre").notNull(),
    tipo: varchar("tipo", { length: 50 }),
    tamano: integer("tamano"),
    subidoPor: varchar("subido_por", { length: 20 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chat = pgTable("chat", {
    id: uuid("id").defaultRandom().primaryKey(),
    estudioId: uuid("estudio_id").references(() => estudios.id, { onDelete: "cascade" }).notNull(),
    proyectoId: uuid("proyecto_id").references(() => proyectos.id, { onDelete: "cascade" }).notNull(),
    contenido: text("contenido").notNull(),
    imagenes: json("imagenes").$type<string[]>().default([]),
    autor: varchar("autor", { length: 20 }).notNull(),
    leido: boolean("leido").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// RELACIONES
// ==========================================

export const estudiosRelations = relations(estudios, ({ many }) => ({
    administradores: many(administradores),
    clientes: many(clientes),
}));

export const administradoresRelations = relations(administradores, ({ one }) => ({
    estudio: one(estudios, {
        fields: [administradores.estudioId],
        references: [estudios.id],
    }),
}));

export const clientesRelations = relations(clientes, ({ one, many }) => ({
    estudio: one(estudios, {
        fields: [clientes.estudioId],
        references: [estudios.id],
    }),
    proyectos: many(proyectos),
}));

export const proyectosRelations = relations(proyectos, ({ one, many }) => ({
    estudio: one(estudios, {
        fields: [proyectos.estudioId],
        references: [estudios.id],
    }),
    cliente: one(clientes, {
        fields: [proyectos.clienteId],
        references: [clientes.id],
    }),
    archivos: many(archivos),
    chat: many(chat),
}));

export const archivosRelations = relations(archivos, ({ one }) => ({
    estudio: one(estudios, {
        fields: [archivos.estudioId],
        references: [estudios.id],
    }),
    proyecto: one(proyectos, {
        fields: [archivos.proyectoId],
        references: [proyectos.id],
    }),
}));

export const chatRelations = relations(chat, ({ one }) => ({
    estudio: one(estudios, {
        fields: [chat.estudioId],
        references: [estudios.id],
    }),
    proyecto: one(proyectos, {
        fields: [chat.proyectoId],
        references: [proyectos.id],
    }),
}));
