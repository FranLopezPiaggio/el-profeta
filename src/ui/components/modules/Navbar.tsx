import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
    return (
        <header className="w-full bg-brand-bone-white backdrop-blur-md border-b border-brand-earth/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
                {/* Logo / Nombre de Marca */}
                <Link
                    href="/"
                    className="pt-14"
                >
                    <Image
                        src="/elprofetalogo-removebg-preview.png"
                        width={160}
                        height={56}
                        priority
                        alt="Logo El Profeta"
                        className="h-30 sm:h-30 w-auto object-contain"
                    />
                </Link>

                {/* Navegación Desktop */}
                <nav aria-label="Navegación principal">
                    <ul className="hidden md:flex items-center gap-6 lg:gap-8 font-passion text-[clamp(1.25rem,1.5vw,1.65rem)] text-stone-900 tracking-wide">
                        <li>
                            <Link href="#cervezas" className="hover:text-brand-green transition-colors">
                                Nuestras Cervezas
                            </Link>
                        </li>
                        <li>
                            <Link href="#nosotros" className="hover:text-brand-green transition-colors">
                                Alquiler Choperas
                            </Link>
                        </li>
                        <li>
                            <Link href="#eventos" className="hover:text-brand-green transition-colors">
                                Eventos
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* CTA Principal */}
                <div className="hidden md:block">
                    <Link
                        href="#contacto"
                        aria-label="Contactar por WhatsApp"
                        className="group relative flex items-center justify-center w-11 h-11 bg-white rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                        <Image
                            src="/whatsapp-color-svgrepo-com.svg"
                            width={28}
                            height={28}
                            alt="" // Alt vacío porque el aria-label del Link ya describe la acción
                            className="w-7 h-7 object-contain"
                        />
                    </Link>
                </div>

                {/* Placeholder para Botón Mobile (se implementará con lógica después) */}
                <button
                    type="button"
                    className="md:hidden p-2 text-brand-earth"
                    aria-label="Abrir menú"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </header>
    );
}