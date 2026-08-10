// src/components/catalogo/BeerGrid.tsx
import { Beer } from '@/types/beers';
import { BeerCard } from './BeerCard';

interface BeerGridProps {
    beers: Beer[];
}

export function BeerGrid({ beers }: BeerGridProps) {
    if (beers.length === 0) {
        return (
            <div className="w-full py-16 text-center bg-white/50 rounded-3xl border border-dashed border-stone-300">
                <p className="font-passion text-2xl text-stone-700">
                    ¡No encontramos cervezas en este estilo!
                </p>
                <p className="font-fredoka text-sm text-stone-500 mt-1">
                    Prueba seleccionando otra categoría en los filtros.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {beers.map((beer) => (
                <BeerCard key={beer.id} beer={beer} />
            ))}
        </div>
    );
}