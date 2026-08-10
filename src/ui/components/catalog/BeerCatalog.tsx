// src/ui/components/catalog/BeerCatalog.tsx
import { FilterBar } from '@/ui/components/catalog/FiltersBar';
import { BeerGrid } from '@/ui/components/catalog/BeerGrid';
import { BeerCategory, Beer } from '@/types/beers';
import Image from 'next/image';

const MOCK_BEERS: Beer[] = [
    {
        id: '1',
        name: 'Golden Ale',
        tagline: 'Refrescante, ligera y de trago fácil. Ideal para días de calor.',
        category: 'golden',
        abv: 4.8,
        ibu: 18,
        price: 3200,
        imageSrc: '/beers/blonde-removebg-preview.png',
        isPopular: true,
    },
    {
        id: '2',
        name: 'IPA Solaria',
        tagline: 'Intenso aroma a lúpulo cítrico y tropical con amargor marcado.',
        category: 'ipa',
        abv: 6.2,
        ibu: 55,
        price: 3800,
        imageSrc: '/beers/blonde-removebg-preview.png',
    },
    {
        id: '3',
        name: 'Red Honey',
        tagline: 'Miel pura de monte combinada con maltas caramelizadas.',
        category: 'honey',
        abv: 5.5,
        ibu: 22,
        price: 3500,
        imageSrc: '/beers/blonde-removebg-preview.png',
        isPopular: true,
    },
];

interface BeerCatalogProps {
    selectedCategory: BeerCategory;
}

export function BeerCatalog({ selectedCategory }: BeerCatalogProps) {
    const filteredBeers = selectedCategory === 'todos'
        ? MOCK_BEERS
        : MOCK_BEERS.filter((beer) => beer.category === selectedCategory);

    return (
        <section id="cervezas" className="min-h-screen py-16 bg-brand-green2 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                <div className="text-center mx-auto space-y-3 flex items-center">
                    <h2 id="nuestras-cervezas" className="font-passion text-4xl text-white tracking-wide">
                        Nuestras Cervezas
                    </h2>
                    <Image
                        src="/logo-removebg-preview.png"
                        alt="El Profeta Logo"
                        width={100}
                        height={100}
                        className='-mt-16'
                    />
                </div>

                <FilterBar />
                <BeerGrid beers={filteredBeers} />

            </div>
        </section>
    );
}