export type BeerCategory = 'todos' | 'ipa' | 'rubias' | 'negras' | 'rojas';

export interface Beer {
    id: string;
    name: string;
    tagline: string;
    category: BeerCategory;
    abv: number; // Alcohol by Volume (%)
    ibu: number; // International Bitterness Units
    price: number;
    style?: string;
    imageSrc: string;
    isPopular?: boolean;
}