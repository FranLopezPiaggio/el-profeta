// src/app/page.tsx
import { Navbar } from '@/ui/components/layout/Navbar';
import { Hero } from '@/ui/components/sections/home/Hero';
import { BeerCatalog } from '@/ui/components/sections/catalog/BeerCatalog';
import { BeerCategory } from '@/types/beers';
import { TopGradientBubbles } from '@/ui/components/common/TopGradientBubbles';
import { Footer } from '@/ui/components/layout/Footer'
import { BentoGridSection } from '@/ui/components/sections/home/BentoGridSection';
import { Testimonials } from '@/ui/components/sections/home/Testimonials';
import { getSheetCached, sheetToBeers, type SheetData } from '@/lib/sheet';

interface PageProps {
    searchParams: Promise<{ categoria?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
    const { categoria } = await searchParams;
    const selectedCategory = (categoria as BeerCategory) || 'todos';
    // ponytail: catálogo espejo Sheet (stock+precio deducidos); sin mock
    const sheet = await getSheetCached<SheetData>();
    const beers = sheetToBeers(sheet);

    return (
        <>
            <Navbar />
            <main className="ww-full mx-auto flex flex-col">
                <Hero />
                <TopGradientBubbles />
                <BeerCatalog selectedCategory={selectedCategory} beers={beers} />
                <BentoGridSection />
                <Testimonials />
                <Footer />
            </main>
        </>
    );
}