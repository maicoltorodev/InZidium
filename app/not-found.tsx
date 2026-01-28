import Link from "next/link"
import { BackgroundGradients } from "@/components/ui/background-gradients"

export default function NotFound() {
    return (
        <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#030014]">
            <BackgroundGradients />

            <div className="relative z-10 text-center px-4">
                <h1 className="font-orbitron text-[120px] sm:text-[180px] font-black leading-none bg-gradient-to-b from-white to-white/10 bg-clip-text text-transparent">
                    404
                </h1>

                <div className="mt-4 mb-12">
                    <h2 className="text-2xl sm:text-3xl font-orbitron text-white mb-4 tracking-wider">
                        SISTEMA FUERA DE LÍNEA
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                        La ruta que intentas acceder no existe en nuestra red. Puede haber sido movida o eliminada.
                    </p>
                </div>

                <Link
                    href="/"
                    className="group relative inline-flex items-center justify-center px-10 py-4 font-orbitron font-bold tracking-[0.2em] text-[12px] text-white border border-cyan-500/50 bg-cyan-500/10 rounded-full transition-all duration-300 hover:bg-cyan-500/20 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                >
                    <span className="relative z-10">RECONECTAR AL INICIO</span>
                    <div className="absolute inset-0 rounded-full bg-cyan-400/5 blur-xl group-hover:bg-cyan-400/20 transition-all duration-300" />
                </Link>
            </div>

            {/* Decorative Grid or lines if desired */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />
        </main>
    )
}
