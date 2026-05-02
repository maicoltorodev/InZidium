"use client";

import type { Message } from "@/lib/crm/types";
import { BubbleContainer } from "./BubbleContainer";
import { BubbleHeader } from "./BubbleHeader";
import { BubbleFooter } from "./BubbleFooter";
import { BubbleActions } from "./BubbleActions";
import { Reactions } from "./Reactions";
import { ReplyContext } from "./ReplyContext";

import { TextContent } from "./content/TextContent";
import { ImageContent } from "./content/ImageContent";
import { AudioContent } from "./content/AudioContent";
import { VideoContent } from "./content/VideoContent";
import { DocumentContent } from "./content/DocumentContent";
import { StickerContent } from "./content/StickerContent";
import { LocationContent } from "./content/LocationContent";
import { InteractiveContent } from "./content/InteractiveContent";
import { PendingMediaContent } from "./content/PendingMediaContent";
import { FailedMediaContent } from "./content/FailedMediaContent";
import { UnknownContent } from "./content/UnknownContent";

type Props = {
    message: Message;
    onReply?: (msg: Message) => void;
    onReact?: (msg: Message, emoji: string) => void;
    /** Query de búsqueda para highlightear matches en el texto. */
    searchQuery?: string;
    /** Si este mensaje es el "match actual" durante la búsqueda, se le da un ring dorado. */
    isCurrentSearchMatch?: boolean;
    /** Username del agente actual, para diferenciar "Tú" vs otro admin. */
    currentUser?: string | null;
};

const MEDIA_TYPES = ["image", "audio", "video", "document", "sticker"] as const;

export function MessageBubble({
    message,
    onReply,
    onReact,
    searchQuery,
    isCurrentSearchMatch,
    currentUser,
}: Props) {
    const { role, wa_type, status, sent_at, reactions, reply_preview } = message;
    const isUser = role === "user";
    const align: "left" | "right" = isUser ? "left" : "right";

    // Stickers e imágenes solas se ven mejor sin el chrome del bubble
    const isBare = wa_type === "sticker" && !message.content;

    // Reply y React requieren wa_message_id (Meta lo necesita para context.message_id)
    const hasWaId = !!message.wa_message_id;
    const handleReply = onReply && hasWaId ? () => onReply(message) : undefined;
    const handleReact = onReact && hasWaId ? (emoji: string) => onReact(message, emoji) : undefined;

    return (
        <div
            data-message-id={message.id}
            className={`group flex ${isUser ? "justify-start" : "justify-end"}`}
        >
            <div
                className={`relative max-w-[75%] min-w-0 transition ${
                    isCurrentSearchMatch
                        ? "ring-2 ring-[#22d3ee]/60 ring-offset-2 ring-offset-[#0a0a0a] rounded-2xl"
                        : ""
                }`}
            >
                <BubbleHeader
                    role={role}
                    waType={wa_type}
                    createdBy={message.created_by}
                    currentUser={currentUser}
                />

                <BubbleContainer role={role} bare={isBare}>
                    {reply_preview && <ReplyContext preview={reply_preview} />}
                    <BubbleBody message={message} searchQuery={searchQuery} />
                    {!isBare && (
                        <BubbleFooter
                            sentAt={sent_at}
                            role={role}
                            status={status}
                            align={isUser ? "left" : "right"}
                        />
                    )}
                </BubbleContainer>

                <BubbleActions
                    side={isUser ? "left" : "right"}
                    onReply={handleReply}
                    onReact={handleReact}
                />

                <Reactions reactions={reactions ?? []} align={isUser ? "left" : "right"} />

                {isBare && (
                    <BubbleFooter
                        sentAt={sent_at}
                        role={role}
                        status={status}
                        align={isUser ? "left" : "right"}
                    />
                )}
            </div>
        </div>
    );
}

function BubbleBody({ message, searchQuery }: { message: Message; searchQuery?: string }) {
    const { wa_type, content, media, metadata } = message;
    const mediaStatus = metadata?.media_status;

    // Media types: chequear si está descargando, falló o ready
    if ((MEDIA_TYPES as readonly string[]).includes(wa_type)) {
        if (mediaStatus === "failed") return <FailedMediaContent reason={metadata?.media_error} />;
        if (!media || mediaStatus === "downloading") return <PendingMediaContent type={wa_type} />;

        if (wa_type === "image") return <ImageContent media={media} caption={content} />;
        if (wa_type === "video") return <VideoContent media={media} caption={content} />;
        if (wa_type === "audio") return <AudioContent media={media} isVoice={metadata?.voice} />;
        if (wa_type === "document") return <DocumentContent media={media} caption={content} />;
        if (wa_type === "sticker") return <StickerContent media={media} />;
    }

    if (wa_type === "location" && metadata?.location) {
        return <LocationContent location={metadata.location} />;
    }

    if (wa_type === "interactive" && metadata?.interactive) {
        return <InteractiveContent interactive={metadata.interactive} />;
    }

    if (wa_type === "text" || wa_type === "system" || wa_type === "template") {
        return <TextContent content={content} highlight={searchQuery} />;
    }

    return <UnknownContent type={wa_type} />;
}
