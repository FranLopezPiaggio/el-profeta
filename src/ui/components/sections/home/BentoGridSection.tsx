import { BentoCard } from '../../common/BentoCard';
import { SectionHeader } from '@/ui/components/sections/choperas-eventos/SectionHeader';
import { BentoItem } from '@/types/bento';

const BENTO_ITEMS: BentoItem[] = [
    {
        id: '1',
        title: 'Lleva a El Profeta a tu Evento',
        description: 'Servicio completo de barras móviles, tiradores de cerveza y atención personalizada para bodas, cumpleaños y eventos corporativos.',
        category: 'Servicio Estrella',
        imageSrc: '/friends-beer2.jpg', // Reemplaza con tu ruta
        colSpan: 'col-span-1 md:col-span-2 lg:col-span-2',
        rowSpan: 'row-span-2',
        ctaText: 'Cotizar Evento',
        ctaLink: '#cotizar',
    },
    {
        id: '2',
        title: 'Alquiler de Barriles y Choperas',
        description: 'Equipos de frío listos para usar con barriles de 20L, 30L y 50L. Instalación rápida en tu fiesta.',
        category: 'Alquiler Directo',
        imageSrc: '/keg3.jpg', // Reemplaza con tu ruta
        colSpan: 'col-span-1 md:col-span-2 lg:col-span-2',
        rowSpan: 'row-span-1',
        ctaText: 'Ver Equipos y Precios',
    },
    {
        id: '3',
        title: 'Ventas al por Mayor',
        description: 'Abastecimiento continuo para bares, restaurantes y distribuidores con precios escalonados.',
        category: 'B2B',
        imageSrc: '/hero-bg.jpg',
        colSpan: 'col-span-1 md:col-span-1 lg:col-span-1',
        rowSpan: 'row-span-1',
        ctaText: 'Catálogo Mayorista',
    },
    {
        id: '4',
        title: '+500 Eventos Impulsados',
        description: 'La cerveza perfecta para acompañar tus mejores momentos.',
        category: 'Comunidad',
        imageSrc: '/chopera-1.jpg', // Reemplaza con tu ruta
        colSpan: 'col-span-1 md:col-span-1 lg:col-span-1',
        rowSpan: 'row-span-1',
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