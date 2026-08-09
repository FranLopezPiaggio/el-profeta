import React from 'react';
import { TESTIMONIALS } from '../data/kegs';
import { Star, Quote, Beer } from 'lucide-react';

export const Testimonials: React.FC = () => {
    return (
        <section className="py-20 bg-[#F3EBDD]/40 border-t border-[#3B2314]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 text-[#7C9031] font-bold text-xs uppercase tracking-widest bg-[#7C9031]/15 px-3.5 py-1.5 rounded-full mb-3 rustic-stamp">
                        <Beer className="w-3.5 h-3.5 text-[#3B2314]" />
                        <span>Comunidad & Opiniones</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#3B2314] tracking-tight">
                        Lo que Dicen los Profetas
                    </h2>
                    <p className="mt-2 text-sm sm:text-base text-[#3B2314]/70">
                        Experiencias reales de clientes, organizadores de eventos y amantes de la buena cerveza.
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#FBF8F1] p-6 rounded-2xl border border-[#3B2314]/12 shadow-warm relative flex flex-col justify-between"
                        >
                            <Quote className="absolute top-4 right-4 w-8 h-8 text-[#D98A29]/20" />

                            <div className="space-y-4 relative z-10">
                                {/* Rating */}
                                <div className="flex text-[#D98A29]">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>

                                <p className="text-sm text-[#3B2314]/85 leading-relaxed italic">
                                    "{item.comment}"
                                </p>
                            </div>

                            {/* Author Footer */}
                            <div className="pt-6 mt-6 border-t border-[#3B2314]/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.avatar}
                                        alt={item.name}
                                        referrerPolicy="no-referrer"
                                        className="w-10 h-10 rounded-full object-cover border border-[#D98A29]"
                                    />
                                    <div>
                                        <h4 className="font-serif text-sm font-bold text-[#3B2314]">{item.name}</h4>
                                        <p className="text-[11px] text-[#3B2314]/60">{item.role}</p>
                                    </div>
                                </div>

                                <span className="bg-[#7C9031]/10 text-[#7C9031] text-[10px] font-bold px-2.5 py-1 rounded-md border border-[#7C9031]/20">
                                    Favorita: {item.beerFav}
                                </span>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};
