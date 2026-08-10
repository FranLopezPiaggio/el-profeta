import Image from 'next/image';
import { BentoItem } from '@/types/bento';

export function BentoCard({
    title,
    description,
    category,
    imageSrc,
    colSpan = 'col-span-1',
    rowSpan = 'row-span-1',
    ctaText,
    ctaLink
}: BentoItem) {
    return (
        <article
            className={`group relative overflow-hidden rounded-2xl bg-brand-cream/10 border border-white/10 p-6 flex flex-col justify-between transition-all duration-300 hover:border-brand-gold/50 hover:shadow-xl ${colSpan} ${rowSpan}`}
        >
            {/* Fondo con imagen y overlay para legibilidad */}
            {imageSrc && (
                <>
                    <div className="absolute inset-0 -z-10 group-hover:scale-105 transition-transform duration-500">
                        <Image src={imageSrc} alt={title} fill className="object-cover" />
                    </div>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-black/90 via-brand-black/50 to-transparent" />
                </>
            )}

            {/* Contenido Superior */}
            <div>
                {category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
                        {category}
                    </span>
                )}
                <h3 className="mt-2 font-passion text-2xl text-white tracking-wide">
                    {title}
                </h3>
                <p className="mt-2 text-sm text-stone-300 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Detalle visual o CTA inferior */}
            <div className="mt-6 flex items-center text-xs text-brand-gold font-medium">
                {ctaText ? (
                    <a href={ctaLink || '#'} className="inline-flex items-center hover:underline">
                        <span>{ctaText}</span>
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                ) : (
                    <div className="flex items-center">
                        <span>Saber más</span>
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                )}
            </div>
        </article>
    );
}