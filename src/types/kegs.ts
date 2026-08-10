export interface KegServiceItem {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    badge?: string;
    ctaText?: string;
    imageSrc?: string;
    benefits?: string[];
    colSpan: string; // ej: 'md:col-span-2' o 'md:col-span-1'
    variant?: 'highlight' | 'standard' | 'dark'; // Para variar fondos/colores
}