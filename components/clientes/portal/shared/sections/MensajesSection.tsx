"use client";

import { Chat, type ChatVariant } from "../Chat";

export function MensajesSection({
  project,
  showToast,
  variant = "mobile",
}: {
  project: any;
  showToast: (msg: string, type: "success" | "error") => void;
  variant?: ChatVariant;
}) {
  return <Chat project={project} showToast={showToast} variant={variant} />;
}
