import Image from 'next/image';
import { Beer } from '@/types/beers';

interface BeerCardProps {
    beer: Beer;
}

export function BeerCard({ beer }: BeerCardProps) {
    return (
        <article className="group relative bg-white p-5 border border-brand-earth/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Badge de Popularidad / Destacado */}
            {beer.isPopular && (
                <span className="absolute top-4 left-4 z-10 bg-brand-gold text-brand-earth font-fredoka text-xs font-bold px-3 py-1 shadow-sm">
                    Popular
                </span>
            )}

            {/* Imagen del Producto con Aspect Ratio Seguro */}
            <div className="relative w-full h-56 my-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image
                    src={beer.imageSrc}
                    alt={`Lata de cerveza ${beer.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain drop-shadow-md"
                />
            </div>

            {/* Información del Producto */}
            <div className="mt-2 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-passion text-2xl text-stone-900 group-hover:text-brand-green transition-colors">
                            {beer.name}
                        </h3>
                        <span className="font-fredoka text-lg font-bold text-brand-earth">
                            ${beer.price.toLocaleString('es-AR')}
                        </span>
                    </div>

                    <p className="font-fredoka text-xs text-stone-500 font-medium line-clamp-2 mt-1">
                        {beer.tagline}
                    </p>
                </div>

                {/* Especificaciones Técnicas (ABV & IBU) */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-fredoka text-stone-600 font-semibold">
                        <span className="bg-stone-100 px-2.5 py-1 rounded-md">
                            ABV: {beer.abv}%
                        </span>
                        <span className="bg-stone-100 px-2.5 py-1 rounded-md">
                            IBU: {beer.ibu}
                        </span>
                    </div>

                    <button
                        type="button"
                        aria-label={`Añadir ${beer.name} al carrito`}
                        className="bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white p-2.5 rounded-full transition-colors active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    );
}