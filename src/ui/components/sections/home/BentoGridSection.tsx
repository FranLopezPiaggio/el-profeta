import { BentoCard } from '../../common/BentoCard';
import { SectionHeader } from '@/ui/components/sections/choperas-eventos/SectionHeader';
import { BentoItem } from '@/types/bento';

const BENTO_ITEMS: BentoItem[] = [
    {
        id: '1',
        title: 'Lleva a El Profeta a tu Evento',
        description: 'Servicio completo de barras móviles, tiradores de cerveza y atención personalizada para bodas, cumpleaños y eventos corporativos.',
        category: 'Servicio Estrella',
        imageSrc: '/friends-beer2.jpg',
        colSpan: 'col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-3 lg:row-start-1',
        rowSpan: 'row-span-1 md:row-span-1 lg:row-span-2',
        ctaText: 'Cotizar Evento',
        ctaLink: '#cotizar',
    },
    {
        id: '3',
        title: 'Alquiler de Barriles y Choperas',
        description: 'Equipos de frío listos para usar con barriles de 20L, 30L y 50L. Instalación rápida en tu fiesta.',
        category: 'Alquiler Directo',
        imageSrc: '/keg3.jpg',
        colSpan: 'col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-3 lg:row-start-3',
        rowSpan: 'row-span-1 md:row-span-2 lg:row-span-4',
        ctaText: 'Ver Equipos y Precios',
    },
    {
        id: '2',
        title: 'Ventas al por Mayor',
        description: 'Abastecimiento continuo para bares, restaurantes y distribuidores con precios escalonados.',
        category: 'B2B',
        imageSrc: '/hero-bg.jpg',
        colSpan: 'col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-start-5',
        rowSpan: 'row-span-1 md:row-span-1 lg:row-span-2',
        ctaText: 'Catálogo Mayorista',
    },
    {
        id: '4',
        title: '+500 Eventos Impulsados',
        description: 'La cerveza perfecta para acompañar tus mejores momentos.',
        category: 'Comunidad',
        imageSrc: '/chopera-1.jpg',
        colSpan: 'col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-start-1',
        rowSpan: 'row-span-1 md:row-span-2 lg:row-span-4',
    },
];

export function BentoGridSection() {
    return (
        <section id="choperas-eventos" className="py-20 bg-brand-green2 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* Header */}
                <SectionHeader
                    badge="Experiencia"
                    title="Alquiler de Barriles y Eventos"
                    subtitle="Lleva el Profeta a tu evento, cumpleaños o fiesta corporativa."
                />

                {/* Bento Grid layout de 4 columnas y 6 filas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-6 auto-rows-[120px] gap-6">
                    {BENTO_ITEMS.map((item) => (
                        <BentoCard key={item.id} {...item} />
                    ))}
                </div>

                {/* CTA (Call to Action) */}
                <div className="text-center pt-4">
                    <button className="px-8 py-3.5 bg-brand-gold text-brand-black font-semibold rounded-xl shadow-lg hover:bg-amber-400 active:scale-95 transition-all duration-200">
                        Quiero El Profeta en mi evento
                    </button>
                </div>

            </div>
        </section>
    );
}