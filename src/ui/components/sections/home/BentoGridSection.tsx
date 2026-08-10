import { BentoCard } from '../../common/BentoCard';
import { SectionHeader } from '../../common/SectionHeader';
import { BentoItem } from '@/types/bento';

const BENTO_ITEMS: BentoItem[] = [
    {
        id: '1',
        title: 'Ingredientes Orgánicos',
        description: 'Utilizamos solo maltas de alta calidad y lúpulos cosechados a mano.',
        category: 'Calidad',
        colSpan: 'md:col-span-2',
    },
    {
        id: '2',
        title: 'Proceso Artesanal',
        description: 'Fermentación lenta respetando los tiempos de la naturaleza.',
        category: 'Tradición',
        colSpan: 'md:col-span-1',
    },
    {
        id: '3',
        title: 'Ediciones Limitadas',
        description: 'Lotes especiales cocinados exclusivamente para cada estación del año.',
        category: 'Exclusivo',
        colSpan: 'md:col-span-1',
    },
    {
        id: '4',
        title: 'Sustentabilidad',
        description: 'Reutilizamos el 100% de nuestros residuos orgánicos como alimento de ganado.',
        category: 'Impacto',
        colSpan: 'md:col-span-2',
    },
];

export function BentoGridSection() {
    return (
        <section className="py-20 bg-brand-green2 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* Header */}
                <SectionHeader
                    badge="Experiencia"
                    title="El Arte de Nuestra Producción"
                    subtitle="Cada receta cuenta una historia. Descubre qué hace a nuestras cervezas únicas desde el primer sorbo."
                />

                {/* Bento Grid layout de 3 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {BENTO_ITEMS.map((item) => (
                        <BentoCard key={item.id} {...item} />
                    ))}
                </div>

                {/* CTA (Call to Action) */}
                <div className="text-center pt-4">
                    <button className="px-8 py-3.5 bg-brand-gold text-brand-black font-semibold rounded-xl shadow-lg hover:bg-amber-400 active:scale-95 transition-all duration-200">
                        Conocer el Proceso Completo
                    </button>
                </div>

            </div>
        </section>
    );
}