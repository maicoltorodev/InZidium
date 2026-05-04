import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminDesktopShell } from "@/components/desktop/admin/AdminDesktopShell";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { SessionGuard } from "./_components/session/SessionGuard";
import { RealtimeProvider } from "./_components/realtime/RealtimeProvider";

/**
 * Validación de sesión simple — solo NextAuth (cookie + JWT firmado).
 *
 * Si querés "sesión única realtime" (eviction cuando otro device loguea con
 * la misma cuenta), agregalo en el callback `session()` del `auth.ts` de este
 * estudio — ahí podés validar `active_session_id` contra DB y devolver null
 * si no coincide. NextAuth se encarga del resto transparentemente.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const isLoginPage = pathname === "/admin/login";

  if (!isLoginPage) {
    const session = await auth();
    if (!session?.user) {
      redirect("/admin/login");
    }
  }

  if (isLoginPage) return <AuthProvider>{children}</AuthProvider>;
  return (
    <AuthProvider>
      <RealtimeProvider>
        <SessionGuard />
        <AdminDesktopShell>{children}</AdminDesktopShell>
      </RealtimeProvider>
    </AuthProvider>
  );
}
