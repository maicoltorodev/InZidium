import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'InZidium - Resultados impulsados por calidad y tecnología'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#050505',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Abstract background elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-10%',
                        width: '60%',
                        height: '80%',
                        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-20%',
                        left: '-10%',
                        width: '60%',
                        height: '80%',
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }}
                />

                {/* Subtle grid pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        opacity: 0.5,
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px',
                        zIndex: 10,
                    }}
                >
                    {/* Logo/Brand */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '28px',
                                fontWeight: 900,
                                letterSpacing: '0.3em',
                                background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            InZidium
                        </div>
                    </div>

                    {/* Headline */}
                    <div
                        style={{
                            display: 'flex',
                            fontSize: '64px',
                            fontWeight: 800,
                            color: 'white',
                            textAlign: 'center',
                            lineHeight: 1.1,
                            marginBottom: '20px',
                            maxWidth: '900px',
                        }}
                    >
                        Diseño y Tecnología que Impulsan tu Negocio
                    </div>

                    {/* Subheader */}
                    <div
                        style={{
                            display: 'flex',
                            fontSize: '24px',
                            color: '#94a3b8',
                            textAlign: 'center',
                            marginBottom: '50px',
                        }}
                    >
                        Páginas Web · Aplicaciones · Automatización · Diseño UI/UX
                    </div>

                    {/* Call to Action */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            color: 'black',
                            padding: '16px 40px',
                            borderRadius: '50px',
                            fontSize: '22px',
                            fontWeight: 700,
                            boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.3)',
                        }}
                    >
                        Inicia tu proyecto hoy →
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '8px',
                        background: 'linear-gradient(90deg, #38bdf8, #818cf8, #a855f7)',
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    )
}
