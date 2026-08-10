import React, { useState } from 'react';
import { Beer, Truck, Package, Check, Sparkles, PhoneCall, Calculator, ShieldCheck, Flame } from 'lucide-react';
import choperaImage from '../assets/images/chopera_keg_1786245672600.jpg';
import { KEG_OPTIONS, BREWERY_INFO } from '../data/kegs';
import { KegOption } from '../types';

interface KegRentalBentoProps {
    onOpenCalculator: () => void;
    onAddKegToCart: (keg: KegOption) => void;
}

export const KegRentalBento: React.FC<KegRentalBentoProps> = ({
    onOpenCalculator,
    onAddKegToCart,
}) => {
    const [selectedKeg, setSelectedKeg] = useState<KegOption>(KEG_OPTIONS[1]); // default 20L
    const [addedKegId, setAddedKegId] = useState<string | null>(null);

    const handleAddKeg = (keg: KegOption) => {
        onAddKegToCart(keg);
        setAddedKegId(keg.id);
        setTimeout(() => {
            setAddedKegId(null);
        }, 1200);
    };

    return (
        <section id="barriles" className="py-20 bg-[#F3EBDD]/60 relative border-y border-[#3B2314]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 text-[#D98A29] font-bold text-xs uppercase tracking-widest bg-[#D98A29]/15 px-3.5 py-1.5 rounded-full mb-3 rustic-stamp">
                        <Beer className="w-3.5 h-3.5 text-[#3B2314]" />
                        <span>Servicio para Eventos & Fiestas</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#3B2314] tracking-tight">
                        ¡Lleva la Cervecería a tu Evento! Alquila tu Barril
                    </h2>
                    <p className="mt-3 text-base sm:text-lg text-[#3B2314]/75">
                        Choperas profesionales de madera rústica, gas CO2, hielo y barriles helados directo a la puerta de tu fiesta.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                    {/* Card 1: Large Feature (Spans 2 cols, 2 rows on desktop) */}
                    <div className="md:col-span-2 md:row-span-2 bg-[#1C1917] text-white rounded-2xl overflow-hidden border border-[#D98A29]/30 shadow-xl relative flex flex-col justify-between group min-h-[420px]">
                        {/* Background Image Container */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={choperaImage}
                                alt="Servicio Completo Chopera + Barril"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/70 to-transparent" />
                        </div>

                        {/* Top Badge */}
                        <div className="relative z-10 p-6 flex items-start justify-between">
                            <span className="bg-[#D98A29] text-stone-950 px-3.5 py-1 rounded-full text-xs font-black tracking-wide shadow-md flex items-center gap-1.5">
                                <span>⭐ El más elegido para eventos</span>
                            </span>
                            <span className="bg-[#7C9031] text-white px-3 py-1 rounded-lg text-xs font-bold border border-white/20">
                                Chopera Profesional
                            </span>
                        </div>

                        {/* Content Bottom */}
                        <div className="relative z-10 p-6 sm:p-8 space-y-4 mt-auto">
                            <div>
                                <h3 className="font-serif text-2xl sm:text-3xl font-black text-amber-200">
                                    Servicio Completo Chopera + Barril
                                </h3>
                                <p className="text-sm sm:text-base text-stone-300 mt-2 max-w-xl leading-relaxed">
                                    Incluye la chopera de tirada perfecta, tubo de gas CO2 regulado, hielo de refresco y todo listo para tirar cerveza bien helada desde la primera copa.
                                </p>
                            </div>

                            {/* Feature bullets */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-bold text-amber-100/90">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#7C9031] shrink-0" />
                                    <span>Serpentina de acero inoxidable alimenticio</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#7C9031] shrink-0" />
                                    <span>Carga de hielo inicial sin costo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#7C9031] shrink-0" />
                                    <span>Instalación y prueba de tiro en vivo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-[#7C9031] shrink-0" />
                                    <span>Retiro al día siguiente</span>
                                </div>
                            </div>

                            <div className="pt-3 flex flex-wrap items-center gap-3">
                                <button
                                    onClick={onOpenCalculator}
                                    className="bg-[#D98A29] hover:bg-[#b8721d] text-stone-950 font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                                >
                                    <Calculator className="w-4 h-4" />
                                    <span>Calcular según mis invitados</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Medium (Capacidades Disponibles - Spans 1 col, 1 row) */}
                    <div className="bg-[#FBF8F1] p-6 rounded-2xl border border-[#3B2314]/15 shadow-md flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#D98A29]/15 text-[#D98A29] flex items-center justify-center border border-[#D98A29]/30">
                                <Package className="w-5 h-5 text-[#3B2314]" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-[#3B2314]">
                                Capacidades Disponibles
                            </h3>
                            <p className="text-xs text-[#3B2314]/70">
                                Elegí el tamaño ideal para tu grupo desde 10L hasta 50L.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {['10 Litros', '20 Litros', '30 Litros', '50 Litros'].map((cap, i) => (
                                <div
                                    key={i}
                                    className="bg-[#F3EBDD] border border-[#3B2314]/10 p-2.5 rounded-xl text-center"
                                >
                                    <p className="text-xs font-black text-[#3B2314]">{cap}</p>
                                    <p className="text-[10px] text-[#7C9031] font-bold">
                                        {i === 0 ? '~20 pintas' : i === 1 ? '~40 pintas' : i === 2 ? '~60 pintas' : '~100 pintas'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 3: Medium (Entrega e Instalación - Spans 1 col, 1 row) */}
                    <div className="bg-[#FBF8F1] p-6 rounded-2xl border border-[#3B2314]/15 shadow-md flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#7C9031]/15 text-[#7C9031] flex items-center justify-center border border-[#7C9031]/30">
                                <Truck className="w-5 h-5 text-[#7C9031]" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-[#3B2314]">
                                Entrega e Instalación
                            </h3>
                            <p className="text-xs text-[#3B2314]/80 leading-relaxed">
                                Te lo llevamos a domicilio en el horario acordado y lo dejamos 100% regulado e instalado listo para disfrutar.
                            </p>
                        </div>

                        <div className="bg-[#7C9031]/10 p-3 rounded-xl border border-[#7C9031]/20 mt-4 flex items-center gap-2 text-xs font-bold text-[#3B2314]">
                            <ShieldCheck className="w-4 h-4 text-[#7C9031] shrink-0" />
                            <span>Garantía de Cerveza Fría desde la 1° copa</span>
                        </div>
                    </div>

                    {/* Card 4: Wide Call-To-Action (Spans 3 cols on desktop) */}
                    <div className="md:col-span-3 bg-[#1C1917] text-white p-6 sm:p-8 rounded-2xl border border-[#D98A29]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#D98A29] flex items-center justify-center text-stone-950 font-black text-xl shrink-0">
                                🍻
                            </div>
                            <div>
                                <h4 className="font-serif text-xl sm:text-2xl font-black text-amber-200">
                                    ¿Tienes una fiesta este fin de semana? Cotiza tu barril en minutos.
                                </h4>
                                <p className="text-xs sm:text-sm text-stone-300 mt-1">
                                    Reserva con anticipación para asegurar tu variedad favorita (IPA, Golden, Amber, Stout).
                                </p>
                            </div>
                        </div>

                        <a
                            href={`https://wa.me/${BREWERY_INFO.whatsappRaw}?text=${encodeURIComponent('¡Hola El Profeta! Quisiera cotizar el alquiler de un barril con chopera para este fin de semana.')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#D98A29] hover:bg-[#b8721d] text-stone-950 font-extrabold px-8 py-3.5 rounded-xl text-sm shadow-lg hover:scale-105 transition-all whitespace-nowrap flex items-center gap-2 shrink-0"
                        >
                            <PhoneCall className="w-4 h-4" />
                            <span>Cotizar por WhatsApp</span>
                        </a>
                    </div>

                </div>

                {/* Interactive Keg Selector Cards */}
                <div className="mt-14 space-y-6">
                    <div className="text-center">
                        <h3 className="font-serif text-2xl font-black text-[#3B2314]">
                            Selecciona la Capacidad de tu Barril
                        </h3>
                        <p className="text-xs text-[#3B2314]/70 mt-1">
                            Todos los precios incluyen alquiler de la chopera, gas CO2 e impuestos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {KEG_OPTIONS.map((keg) => {
                            const isSelected = selectedKeg.id === keg.id;
                            const isAdded = addedKegId === keg.id;

                            return (
                                <div
                                    key={keg.id}
                                    onClick={() => setSelectedKeg(keg)}
                                    className={`relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                                            ? 'bg-[#FBF8F1] border-[#D98A29] shadow-lg ring-2 ring-[#D98A29]/30 -translate-y-1'
                                            : 'bg-[#F3EBDD] border-[#3B2314]/12 hover:bg-[#FBF8F1] hover:border-[#3B2314]/20'
                                        }`}
                                >
                                    {keg.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D98A29] text-stone-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                                            ⭐ Más Elegido
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start pt-2">
                                            <div>
                                                <span className="font-serif text-3xl font-black text-[#3B2314]">
                                                    {keg.capacityLiters}L
                                                </span>
                                                <p className="text-xs font-bold text-[#7C9031]">~{keg.pintsApprox} pintas</p>
                                            </div>
                                            <span className="text-xs font-semibold text-[#3B2314]/60 bg-[#3B2314]/5 px-2.5 py-1 rounded-lg">
                                                {keg.recommendedGuests}
                                            </span>
                                        </div>

                                        <div className="pt-2 border-t border-[#3B2314]/10 space-y-1.5 text-xs text-[#3B2314]/80">
                                            {keg.features.map((feat, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-[#7C9031] shrink-0" />
                                                    <span className="line-clamp-1">{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-[#3B2314]/10 mt-6 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] uppercase text-[#3B2314]/50 font-bold block">Total</span>
                                            <span className="font-serif text-xl font-black text-[#3B2314]">
                                                ${keg.price.toLocaleString()}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddKeg(keg);
                                            }}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${isAdded
                                                    ? 'bg-[#7C9031] text-white'
                                                    : 'bg-[#D98A29] hover:bg-[#b8721d] text-stone-950'
                                                }`}
                                        >
                                            {isAdded ? '¡Agregado!' : 'Alquilar'}
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};