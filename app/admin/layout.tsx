import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { auth as authService } from "@/lib/data/service";
import { AdminDesktopShell } from "@/components/desktop/admin/AdminDesktopShell";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { SessionGuard } from "./_components/session/SessionGuard";
import { RealtimeProvider } from "./_components/realtime/RealtimeProvider";

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

    const sessionId = (session.user as any).sessionId as string | undefined;
    const adminId = (session.user as any).id as string | undefined;

    if (sessionId && adminId) {
      const admin = await authService.getUserById(adminId);
      if (!admin) {
        redirect("/admin/login");
      }
      // Solo comparar si el activeSessionId es del mismo entorno (prod: o dev:)
      // Así el servidor local y Vercel no se invalidan mutuamente
      const currentEnv = process.env.NODE_ENV === "production" ? "prod" : "dev";
      const dbSessionEnv = admin.activeSessionId?.split(":")[0];
      if (
        admin.activeSessionId &&
        dbSessionEnv === currentEnv &&
        admin.activeSessionId !== sessionId
      ) {
        redirect("/admin/login?reason=concurrent");
      }
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
