'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { BeerCategory } from '@/types/beers';

interface FilterOption {
    label: string;
    value: BeerCategory;
}

const CATEGORIES: FilterOption[] = [
    { label: 'Todas', value: 'todos' },
    { label: 'IPAs', value: 'ipa' },
    { label: 'Golden & Lager', value: 'golden' },
    { label: 'Honey & Sweet', value: 'honey' },
    { label: 'Negras & Stout', value: 'stout' },
];

export function FilterBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Leemos la categoría actual de la URL o usamos 'todos' por defecto
    const currentCategory = (searchParams.get('categoria') as BeerCategory) || 'todos';

    const handleFilterChange = (category: BeerCategory) => {
        const params = new URLSearchParams(searchParams);

        if (category === 'todos') {
            params.delete('categoria');
        } else {
            params.set('categoria', category);
        }

        // Actualiza la URL sin recargar la página completa
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="max-w-[1200px]mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => {
                    const isActive = currentCategory === cat.value;
                    return (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() => handleFilterChange(cat.value)}
                            className={`
                px-5 py-2 font-fredoka text-sm font-semibold whitespace-nowrap transition-all duration-200
                ${isActive
                                    ? 'bg-brand-green text-white shadow-md scale-105'
                                    : 'bg-white/80 text-stone-700 hover:bg-brand-gold/20 hover:text-brand-bone-white'
                                }
              `}
                        >
                            {cat.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}