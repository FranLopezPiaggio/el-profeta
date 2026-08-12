import Image from 'next/image';
import Link from 'next/link';
import { ScaleIn } from '../../common/ScaleIn';

export function Hero() {
    return (
        /* 1. Quitamos bg-brand-cream del section para evitar que tape capas con -z */
        <section className="relative overflow-hidden py-16 lg:py-24">

            {/* 2. CAPA DE FONDO: Eliminamos -z-10 y usamos z-0 para mantener el control dentro del stacking context */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <Image
                    src="/hero-hopspatron-bg.png"
                    alt="Patio cervecero Lúpulo y Sol"
                    fill
                    priority
                    sizes="100vw"
                    /* MODIFICACIÓN: Aumentamos opacidad a 50% y ajustamos blur a 1px */
                    className="object-cover object-center opacity-50 blur-[1px] scale-105"
                />

                {/* MODIFICACIÓN: Overlay más suave (de 40% a 80% en lugar de 80% a 100%) */}
                <div className="absolute inset-0" />
            </div>

            {/* 3. CONTENIDO PRINCIPAL: Asignamos z-10 explícito para forzarlo arriba de la imagen */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Columna Izquierda: Mensaje & CTAs */}
                    <div className="flex flex-col items-start space-y-6">
                        {/* <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-gold/30 text-brand-earth border border-brand-gold/40 shadow-sm backdrop-blur-md">
                            <span className="text-sm">☀️</span> Cerveza Fresca & Artesanal
                        </span> */}

                        <h1 className="font-passion text-[clamp(2.5rem,6vw,5rem)] font-bold text-brand-green leading-[0.85] drop-shadow-sm">
                            <span className="block">Sabor real</span>
                            <span className="block">para dias de</span>
                            <span className="text-brand-gold">sol y amigos.</span>
                        </h1>

                        <p className="font-fredoka text-lg text-brand-earth max-w-xl leading-relaxed font-medium bg-brand-bone-white/65 backdrop-blur-md border border-brand-earth/5 p-4 sm:p-6 rounded-2xl shadow-sm">
                            Elaboramos lotes pequeños con ingredientes naturales y mucha paciencia. Ven a disfrutar de nuestro patio cervecero o llévate tus estilos favoritos a casa.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                            <Link
                                href="#cervezas"
                                className="font-body font-bold text-center bg-brand-gold text-brand-earth px-8 py-3.5 rounded-full hover:bg-amber-400 transition-colors shadow-md active:scale-95"
                            >
                                Ver Cervezas de la Casa
                            </Link>
                        </div>
                    </div>
                    {/* Columna Derecha: Imagen del Producto Centrada & Responsive */}
                    <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[520px] flex items-center justify-center lg:justify-end">
                        <div className="relative w-full h-full max-w-lg transition-transform duration-300 hover:scale-105">
                            {/* <ScaleIn> */}
                            <Image
                                src="/latas-el-profeta.png"
                                alt="Latas cerveza artesanal El Profeta"
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-contain object-center lg:object-right drop-shadow-2xl"
                            />
                            {/* </ScaleIn> */}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}