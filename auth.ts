import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { auth as authService } from "./lib/alliance/data/service";
import { authSecret } from "./lib/env";

const SESSION_MAX_AGE = 24 * 60 * 60; // 24 horas

/**
 * 🛡️ NEXTAUTH v5
 * - Sesiones persistentes de 24h (sobreviven cierre de navegador)
 * - Sesión única por administrador (nueva sesión invalida la anterior vía
 *   `active_session_id` en la tabla `administradores`)
 * - Cookie httpOnly + sameSite=lax + secure en producción
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
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
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: SESSION_MAX_AGE,
            },
        },
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                try {
                    const user = await authService.getUserByUsername(
                        credentials.username as string,
                    );

                    if (!user || !user.passwordHash) return null;

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password as string,
                        user.passwordHash,
                    );

                    if (!isPasswordCorrect) return null;

                    // Generar nuevo ID de sesión único y guardarlo en DB.
                    // Esto invalida automáticamente cualquier sesión anterior del
                    // mismo admin. Prefijo dev:/prod: aísla entornos.
                    const env =
                        process.env.NODE_ENV === "production" ? "prod" : "dev";
                    const sessionId = `${env}:${globalThis.crypto.randomUUID()}`;
                    try {
                        await authService.updateSessionId(user.id, sessionId);
                    } catch (sessionErr) {
                        console.error(
                            "No se pudo guardar sessionId en DB:",
                            sessionErr,
                        );
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
                token.id = (user as any).id;
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
});
