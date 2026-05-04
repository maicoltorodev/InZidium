import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";
import { authSecret } from "@/lib/env";

const SESSION_MAX_AGE = 24 * 60 * 60; // 24 horas

/**
 * 🛡️ NEXTAUTH v5
 * - Sesiones persistentes de 24h (sobreviven cierre de navegador)
 * - Cookie httpOnly + sameSite=lax + secure en producción
 * - Auth contra la DB del estudio (`administradores` en `supabaseAdmin` raíz).
 *   La Alianza no se entera de los admins — son locales al estudio.
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
                    const { data: user } = await supabaseAdmin
                        .from("administradores")
                        .select("id, nombre, username, password_hash")
                        .eq("username", credentials.username as string)
                        .maybeSingle();

                    if (!user || !user.password_hash) return null;

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password as string,
                        user.password_hash,
                    );

                    if (!isPasswordCorrect) return null;

                    return {
                        id: user.id,
                        name: user.nombre,
                        username: user.username,
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
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).username = token.username;
            }
            return session;
        },
    },
});
