// src/app/page.tsx
import { Navbar } from '@/ui/components/modules/Navbar';
import { Hero } from '@/ui/components/modules/Hero';
import { BeerCatalog } from '@/ui/components/catalog/BeerCatalog';
import { BeerCategory } from '@/types/beers';

interface PageProps {
    searchParams: Promise<{ categoria?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
    const { categoria } = await searchParams;
    const selectedCategory = (categoria as BeerCategory) || 'todos';

    return (
        <>
            <Navbar />
            <main className="w-full mx-auto space-y-8">
                <Hero />
                <BeerCatalog selectedCategory={selectedCategory} />
            </main>
        </>
    );
}