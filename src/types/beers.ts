export type BeerCategory = 'todos' | 'ipa' | 'golden' | 'honey' | 'stout';

export interface Beer {
    id: string;
    name: string;
    tagline: string;
    category: BeerCategory;
    abv: number; // Alcohol by Volume (%)
    ibu: number; // International Bitterness Units
    price: number;
    imageSrc: string;
    isPopular?: boolean;
}