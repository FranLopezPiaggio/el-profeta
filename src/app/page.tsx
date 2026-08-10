// src/app/page.tsx
import { Navbar } from '@/ui/components/layout/Navbar';
import { Hero } from '@/ui/components/sections/home/Hero';
import { BeerCatalog } from '@/ui/components/sections/catalog/BeerCatalog';
import { BeerCategory } from '@/types/beers';
import { TopGradientBubbles } from '@/ui/components/common/TopGradientBubbles';
import { Footer } from '@/ui/components/layout/Footer'
import { BentoGridSection } from '@/ui/components/sections/home/BentoGridSection';

interface PageProps {
    searchParams: Promise<{ categoria?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
    const { categoria } = await searchParams;
    const selectedCategory = (categoria as BeerCategory) || 'todos';

    return (
        <>
            <Navbar />
            <main className="ww-full mx-auto flex flex-col">
                <Hero />
                <TopGradientBubbles />
                <BeerCatalog selectedCategory={selectedCategory} />
                <BentoGridSection />
                <div className="bg-[url('/bg-grey-hops.png')] w-full h-[500px]" />
                <Footer />
            </main>
        </>
    );
}