// src/ui/components/catalog/BeerCatalog.tsx
import { FilterBar } from '@/ui/components/sections/catalog/FiltersBar';
import { BeerGrid } from '@/ui/components/sections/catalog/BeerGrid';
import { BeerCategory, Beer } from '@/types/beers';
import { ScaleIn } from '../../common/ScaleIn';
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
        <section
            id="cervezas"
            className="min-h-screen py-10 relative bg-gradient-to-b from-brand-gold via-brand-gold to-brand-gold/90"
        >
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 space-y-10">
                <div className="text-center mx-auto space-y-3 flex items-center">
                    <h2 id="nuestras-cervezas" className="font-passion text-4xl text-white tracking-wide">
                        Nuestras Cervezas
                    </h2>
                    <ScaleIn className="inline-block">
                        <Image
                            src="/logo-removebg-preview.png"
                            alt="El Profeta Logo"
                            width={100}
                            height={100}
                            className="-mt-16 ml-8 z-20"
                        />
                    </ScaleIn>
                </div>

                <FilterBar />
                <BeerGrid beers={filteredBeers} />
            </div>
        </section>
    );
};

//     return (
//         // <section id="cervezas" className="min-h-screen py-10 bg-gradient bg-brand-gold relative mt-[-40px]">
//         <section
//             id="cervezas"
//             className="min-h-screen py-10 relative mt-[-50px] bg-gradient-to-b from-brand-gold/80 via-brand-gold/90 to-brand-gold/100"
//         >
//             {/* Difuminado superior superpuesto */}
//             {/* <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-brand-gold/0 via-brand-gold/30 via-brand-gold/70 to-brand-gold pointer-events-none -translate-y-full" /> */}
//             <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 space-y-10">

//                 <div className="text-center mx-auto space-y-3 flex items-center ">
//                     <h2 id="nuestras-cervezas" className="font-passion text-4xl text-white tracking-wide">
//                         Nuestras Cervezas
//                     </h2>
//                     <Image
//                         src="/logo-removebg-preview.png"
//                         alt="El Profeta Logo"
//                         width={100}
//                         height={100}
//                         className="-mt-16 z-20"
//                     />
//                 </div>

//                 <FilterBar />
//                 <BeerGrid beers={filteredBeers} />

//             </div>
//         </section>
//     );
// }