export interface BentoItem {
    id: string;
    title: string;
    description: string;
    category?: string;
    imageSrc?: string;
    colSpan?: string; // Clases opcionales de grid span (ej: 'md:col-span-2')
    rowSpan?: string;
    ctaText?: string;
    ctaLink?: string;
}