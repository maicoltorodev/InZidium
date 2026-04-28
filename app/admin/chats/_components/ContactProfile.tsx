"use client";

import { Tag, FileText, User, Sparkles } from "lucide-react";
import type { ConversationWithContact } from "@/lib/crm/types";
import { Section } from "./profile/Section";
import { AvatarCard } from "./profile/AvatarCard";
import { FilesButton } from "./files/FilesButton";

type Props = { conversation: ConversationWithContact };

export function ContactProfile({ conversation }: Props) {
    const { contact } = conversation;
    const displayName = contact.name?.trim() || contact.phone;
    const prefEntries = Object.entries(contact.preferences ?? {}).filter(
        ([, v]) => v !== null && v !== undefined && v !== "",
    );

    return (
        <div className="flex h-full flex-col">
            <ProfileHeader contactId={contact.id} contactName={displayName} />

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <AvatarCard contact={contact} />

                {contact.tags && contact.tags.length > 0 && (
                    <Section icon={Tag} label="Etiquetas" accent="#FFD700">
                        <div className="flex flex-wrap gap-1.5">
                            {contact.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-gray-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}

                {prefEntries.length > 0 && (
                    <Section icon={Sparkles} label="Datos de Izzy" accent="#FFD700">
                        <div className="space-y-2.5">
                            {prefEntries.map(([key, value]) => (
                                <div key={key} className="flex items-start justify-between gap-3">
                                    <span className="text-[10px] uppercase tracking-wider text-gray-600 shrink-0 font-bold">
                                        {key.replace(/_/g, " ")}
                                    </span>
                                    <span className="text-right text-xs font-medium text-gray-200 break-all">
                                        {String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {contact.notes && (
                    <Section icon={FileText} label="Notas" accent="#ffffff">
                        <p className="text-xs leading-relaxed text-gray-400 whitespace-pre-wrap">
                            {contact.notes}
                        </p>
                    </Section>
                )}
            </div>
        </div>
    );
}

function ProfileHeader({
    contactId,
    contactName,
}: {
    contactId: string;
    contactName: string;
}) {
    return (
        <div className="shrink-0 border-b border-white/[0.05] px-5 py-5">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08]"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.12))",
                        }}
                    >
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 font-[family-name:var(--font-orbitron)]">
                            Profile
                        </p>
                        <p className="text-sm font-bold text-white leading-tight">Cliente</p>
                    </div>
                </div>
                <FilesButton contactId={contactId} contactName={contactName} />
            </div>
        </div>
    );
}
