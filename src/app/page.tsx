import { Hero } from '@/ui/components/modules/Hero';
import { Catalog } from '@/ui/components/modules/Catalog';

export default function HomePage() {
    return (
        <>
            <Hero />
            <div className='w-full h-[100vh] bg-brand-green2'>
                <Catalog />
            </div>
        </>
    );
}