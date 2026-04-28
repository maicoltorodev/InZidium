'use client';

import { SessionProvider } from "next-auth/react";

/**
 * Refetch agresivo del cliente:
 *  - cada 30s revalidamos contra /api/auth/session
 *  - también al volver el foco a la pestaña
 *
 * Esto permite que SessionGuard detecte rápido cuando otro admin loguea en otra
 * pestaña y la cookie compartida cambia bajo nuestros pies.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={30} refetchOnWindowFocus>
      {children}
    </SessionProvider>
  );
}
