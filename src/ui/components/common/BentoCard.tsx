import Image from 'next/image';
import { BentoItem } from '@/types/bento';
import { ContactTrigger } from '@/ui/components/modals/ContactTrigger';

export function BentoCard({
    title,
    description,
    category,
    imageSrc,
    colSpan = 'col-span-1',
    rowSpan = 'row-span-1',
    ctaText
}: BentoItem) {
    return (
        <article
            className={`group relative overflow-hidden rounded-2xl bg-stone-900/60 border border-white/10 p-6 flex flex-col justify-between transition-all duration-300 hover:border-brand-gold/50 hover:shadow-xl min-h-[220px] ${colSpan} ${rowSpan}`}
        >
            {/* Fondo con imagen y overlay para legibilidad */}
            {imageSrc && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
                </div>
            )}

            {/* Contenido Superior */}
            <div className="relative z-10">
                {category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
                        {category}
                    </span>
                )}
                <h3 className="mt-2 font-passion text-2xl text-white tracking-wide">
                    {title}
                </h3>
                <p className="mt-2 text-sm text-stone-300 leading-relaxed font-body">
                    {description}
                </p>
            </div>

            {/* CTA Inferior envuelto en ContactTrigger */}
            <div className="relative z-10 mt-6">
                <ContactTrigger className="inline-flex items-center text-xs text-brand-gold font-body font-bold hover:underline">
                    <span>{ctaText || 'Saber más'}</span>
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </ContactTrigger>
            </div>
        </article>
    );
}