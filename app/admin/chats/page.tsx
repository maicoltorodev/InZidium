import { ChatsClient } from "./_components/ChatsClient";

// Altura fija al viewport (menos header móvil de 3.5rem).
// `overflow-hidden` evita que el chat empuje a `<main>` a scrollear —
// el scroll vive dentro del recuadro de mensajes (ConversationDetail).
export default function ChatsPage() {
    return (
        <div className="h-[calc(100dvh-3.5rem)] lg:h-screen overflow-hidden">
            <ChatsClient />
        </div>
    );
}
