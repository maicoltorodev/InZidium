import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth as authService } from "./data/service";
import bcrypt from "bcryptjs";
import { authSecret } from "@/lib/env";
import { randomUUID } from "crypto";

const SESSION_MAX_AGE = 24 * 60 * 60; // 24 horas en segundos

/**
 * 🛡️ CONFIGURACIÓN DE NEXTAUTH
 * Desacoplado de la base de datos mediante el DataService.
 * - Sesiones persistentes de 24h (sobreviven cierre de navegador)
 * - Sesión única por administrador (nueva sesión invalida la anterior)
 */

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: SESSION_MAX_AGE, // Cookie persistente: sobrevive al cierre del navegador
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const user = await authService.getUserByUsername(
            credentials.username,
          );

          if (!user || !user.passwordHash) return null;

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.passwordHash,
          );

          if (!isPasswordCorrect) return null;

          // Generar nuevo ID de sesión único y guardarlo en DB.
          // Esto invalida automáticamente cualquier sesión anterior del mismo admin.
          // Wrapped en try/catch propio para que un error de DB no bloquee el login.
          const env = process.env.NODE_ENV === "production" ? "prod" : "dev";
          const sessionId = `${env}:${randomUUID()}`;
          try {
            await authService.updateSessionId(user.id, sessionId);
          } catch (sessionErr) {
            console.error("No se pudo guardar sessionId en DB:", sessionErr);
          }

          return {
            id: user.id,
            name: user.nombre,
            username: user.username,
            sessionId,
          } as any;
        } catch (e) {
          console.error("Error during authorization:", e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.sessionId = (user as any).sessionId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).sessionId = token.sessionId;
      }
      return session;
    },
  },
};
