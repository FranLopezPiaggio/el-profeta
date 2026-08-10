'use client';

import { useState, useEffect } from 'react';
import { Beer, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

const STORAGE_KEY = 'el_profeta_age_verified';

export function AgeVerificationModal() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [underageWarning, setUnderageWarning] = useState<boolean>(false);
    const [hasMounted, setHasMounted] = useState<boolean>(false);

    useEffect(() => {
        setHasMounted(true);
        const isVerified = localStorage.getItem(STORAGE_KEY);
        if (!isVerified) {
            setIsOpen(true);
        }
    }, []);

    // Bloqueo del scroll del body cuando el modal está activo
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleConfirm = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsOpen(false);
    };

    const handleUnderage = () => {
        setUnderageWarning(true);
    };

    // Previene errores de hidratación asegurando renderizado idéntico SSR/Client
    if (!hasMounted || !isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="relative w-full max-w-md bg-brand-cream rounded-3xl border-2 border-brand-earth/20 shadow-2xl p-6 sm:p-8 text-center space-y-6">

                {/* Emblem */}
                <div className="mx-auto flex items-center justify-center">
                    <Image
                        src="/logo-removebg-preview.png"
                        alt="El Profeta Logo"
                        width={100}
                        height={100}
                        className=''
                    />
                </div>

                <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-brand-green block mb-1">
                        Verificación de Edad (+18)
                    </span>
                    <h3 id="modal-title" className="font-passion text-3xl font-bold text-brand-earth tracking-wide">
                        ¡Bienvenido a El Profeta!
                    </h3>
                    <p className="font-fredoka text-sm text-stone-600 mt-2 leading-relaxed">
                        Para disfrutar de nuestras recetas artesanales y alquilar choperas, debes ser mayor de edad según la legislación vigente.
                    </p>
                </div>

                {underageWarning ? (
                    <div className="p-4 bg-red-100 text-red-900 rounded-2xl border border-red-300 text-xs font-semibold flex items-center gap-3 text-left">
                        <ShieldAlert className="w-6 h-6 text-red-700 shrink-0" />
                        <span>Lo sentimos. Debes ser mayor de 18 años para ingresar al sitio. El consumo de alcohol requiere responsabilidad.</span>
                    </div>
                ) : (
                    <div className="space-y-3 pt-2">
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="w-full py-3.5 rounded-full bg-brand-gold hover:bg-amber-400 text-brand-earth font-fredoka font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            Sí, soy mayor de 18 años
                        </button>

                        <button
                            type="button"
                            onClick={handleUnderage}
                            className="w-full py-2.5 rounded-full border border-brand-earth/20 text-stone-600 font-fredoka font-medium text-xs hover:bg-brand-earth/5 transition-colors"
                        >
                            No, soy menor de 18 años
                        </button>
                    </div>
                )}

                <p className="font-fredoka text-[11px] text-stone-500 italic">
                    Beber con moderación. Prohibida la venta a menores de 18 años.
                </p>

            </div>
        </div>
    );
}