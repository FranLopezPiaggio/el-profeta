export type BeerCategory = 'todas' | 'ipas' | 'rubias' | 'negras' | 'especiales';

export interface Beer {
    id: string;
    name: string;
    tagline: string;
    category: 'ipas' | 'rubias' | 'negras' | 'especiales';
    categoryLabel: string;
    abv: number; // Alcohol By Volume percentage
    ibu: number; // International Bitterness Units
    price: number;
    description: string;
    flavorNotes: string[];
    pairing: string;
    colorHex: string;
    glassType: string;
    badge?: string;
    profiles: {
        amargor: number; // 1-5 scale
        dulzor: number;
        cuerpo: number;
        aroma: number;
    };
    ingredients: {
        maltas: string[];
        lupulos: string[];
        miel?: string;
    };
    image: string;
}

export interface KegOption {
    id: string;
    capacityLiters: number;
    pintsApprox: number;
    recommendedGuests: string;
    price: number;
    popular?: boolean;
    features: string[];
}

export interface CartItem {
    id: string; // unique cart item id (beer id or keg id + capacity)
    type: 'beer' | 'keg';
    title: string;
    subtitle: string;
    unitPrice: number;
    quantity: number;
    details?: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    comment: string;
    rating: number;
    beerFav: string;
    avatar: string;
}