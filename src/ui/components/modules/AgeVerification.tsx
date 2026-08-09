import React, { useState, useEffect } from 'react';
import { Beer, ShieldAlert } from 'lucide-react';

export const AgeVerificationModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [underageWarning, setUnderageWarning] = useState(false);

    useEffect(() => {
        const verified = localStorage.getItem('el_profeta_age_verified');
        if (!verified) {
            setIsOpen(true);
        }
    }, []);

    const handleConfirm = () => {
        localStorage.setItem('el_profeta_age_verified', 'true');
        setIsOpen(false);
    };

    const handleUnderage = () => {
        setUnderageWarning(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-[#FBF8F1] rounded-2xl border-2 border-[#3B2314]/30 shadow-2xl p-6 sm:p-8 text-center space-y-6">

                {/* Emblem */}
                <div className="w-16 h-16 rounded-2xl bg-[#3B2314] text-[#D98A29] mx-auto flex items-center justify-center shadow-lg border border-[#D98A29]/40">
                    <Beer className="w-8 h-8 text-[#D98A29]" />
                </div>

                <div>
                    <span className="text-[11px] uppercase font-bold tracking-widest text-[#7C9031] block mb-1">
                        Verificación de Edad (+18)
                    </span>
                    <h3 className="font-serif text-2xl font-black text-[#3B2314]">
                        ¡Bienvenido a El Profeta!
                    </h3>
                    <p className="text-xs text-[#3B2314]/75 mt-2 leading-relaxed">
                        Para disfrutar de nuestras recetas artesanales y alquilar barriles, debes ser mayor de edad según la legislación de tu país.
                    </p>
                </div>

                {underageWarning ? (
                    <div className="p-4 bg-red-100 text-red-900 rounded-xl border border-red-300 text-xs font-bold flex items-center gap-2 text-left">
                        <ShieldAlert className="w-5 h-5 text-red-700 shrink-0" />
                        <span>Lo sentimos. Debes ser mayor de 18 años para ingresar al sitio. El consumo de alcohol requiere responsabilidad.</span>
                    </div>
                ) : (
                    <div className="space-y-3 pt-2">
                        <button
                            onClick={handleConfirm}
                            className="w-full py-3.5 rounded-xl bg-[#D98A29] hover:bg-[#b8721d] text-stone-950 font-extrabold text-sm shadow-md transition-all transform hover:scale-[1.02]"
                        >
                            Sí, soy mayor de 18 años
                        </button>

                        <button
                            onClick={handleUnderage}
                            className="w-full py-2.5 rounded-xl border border-[#3B2314]/20 text-[#3B2314]/70 font-semibold text-xs hover:bg-[#F3EBDD]"
                        >
                            No, soy menor de 18 años
                        </button>
                    </div>
                )}

                <p className="text-[10px] text-[#3B2314]/50 italic">
                    Beber con moderación. Prohibida la venta a menores de 18 años.
                </p>

            </div>
        </div>
    );
};