import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Beer, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-brand-green2 text-brand-bone-white pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Grid Principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3B2314]/60">

                    {/* Columna 1: Brand & Bio */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo-removebg-preview.png"
                                alt="El Profeta Logo"
                                width={100}
                                height={100}
                                className="-mt-10 z-20"
                            />
                            <span className="font-passion text-2xl font-black tracking-wider text-white uppercase">
                                El Profeta
                            </span>
                        </div>
                        <p className="text-sm font-body text-[#F3EBDD]/70 leading-relaxed">
                            Cerveza artesanal elaborada con pasión. Llevamos la mejor experiencia de tirada directa a tus eventos y reuniones.
                        </p>
                    </div>

                    {/* Columna 2: Enlaces Rápidos */}
                    <div className="space-y-4">
                        <h4 className="font-passion text-base font-bold text-white tracking-wide">
                            Servicios & Eventos
                        </h4>
                        <ul className="space-y-2.5 font-body text-sm text-[#F3EBDD]/70">
                            <li>
                                <Link href="#eventos" className="hover:text-[#D98A29] transition-colors">
                                    Alquiler de Barriles & Choperas
                                </Link>
                            </li>
                            <li>
                                <Link href="#eventos" className="hover:text-[#D98A29] transition-colors">
                                    El Profeta en tu Evento
                                </Link>
                            </li>
                            <li>
                                <Link href="#mayorista" className="hover:text-[#D98A29] transition-colors">
                                    Ventas al por Mayor (B2B)
                                </Link>
                            </li>
                            <li>
                                <Link href="#catalogo" className="hover:text-[#D98A29] transition-colors">
                                    Estilos de Cerveza
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Contacto Directo */}
                    <div className="space-y-4">
                        <h4 className="font-passion text-base font-bold text-white tracking-wide">
                            Contacto
                        </h4>
                        <ul className="space-y-3 text-sm font-body text-[#F3EBDD]/70">
                            <li className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-[#D98A29] flex-shrink-0" />
                                <span>+54 (11) 1234-5678</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-[#D98A29] flex-shrink-0" />
                                <span>eventos@cervezaelprofeta.com</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <MapPin className="w-4 h-4 text-[#D98A29] flex-shrink-0" />
                                <span>Fábrica & Taproom, Argentina</span>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Redes & Horarios */}
                    <div className="space-y-4">
                        <h4 className="font-passion text-base font-bold text-white tracking-wide">
                            Atención a Eventos
                        </h4>
                        <p className="text-xs font-body text-[#F3EBDD]/60">
                            Lunes a Sábados: 09:00 - 20:00 hs.<br />
                            Reserva de chopperas con 48hs de anticipación.
                        </p>
                        <div className="pt-2">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B2314]/40 border border-[#3B2314] text-xs font-semibold text-white hover:border-[#D98A29] hover:text-[#D98A29] transition-all"
                            >
                                <span>@cervezaelprofeta</span>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar / Copyright */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#F3EBDD]/50 gap-4">
                    <p>
                        &copy; {new Date().getFullYear()} Cerveza Artesanal El Profeta. Todos los derechos reservados.
                    </p>
                    <p className="text-center md:text-right">
                        El consumo excesivo de alcohol es perjudicial para la salud. Prohibida su venta a menores de 18 años.
                    </p>
                </div>

            </div>
        </footer>
    );
}