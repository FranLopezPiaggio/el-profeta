import { unstable_cache } from 'next/cache';

const SHEET_URL = 'https://script.google.com/macros/s/AKfycby7ZfA_-VqqYL0cG-we3cUmP1kaKTY_4D3l5VjfjqIg2jFwbwy8vx1W5r_jsmT9Si-QrA/exec';

async function fetchSheetRaw<T>(accion?: string): Promise<T | null> {
    try {
        const url = `${SHEET_URL}?${accion ? `accion=${accion}&` : ''}v=${Date.now()}`;
        const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(30000) });
        if (!res.ok) return null;
        const text = (await res.text()).replace(/^\uFEFF/, '').trim();
        const json = JSON.parse(text);
        return json?.error ? null : (json as T);
    } catch {
        return null;
    }
}

// ponytail: vivo barato — 60s cache + tag para Sync manual
export const getSheetCached = unstable_cache(fetchSheetRaw, ['sheet-dashboard'], { tags: ['sheet-dashboard'], revalidate: 60 });

export type SheetData = {
    stockGeneral: Record<string, number>;
    usuarios: Record<string, { stock: Record<string, number>; stockSinEtiqueta: Record<string, number> }>;
    clientes: { nombre: string; deuda: number; pagado: number }[];
    barrilesDisponibles: { id: string; tipo: string; tamano: string; serie: string }[];
    totalIngresadoSheet: number;
    efectivoSheet: number;
    transferenciaSheet: number;
    paraProfetaSheet: number;
    configuracion: Record<string, number>;
    cicloFechaCorte: number;
    profetaInicialCiclo: number;
    historialStock: { fecha: string; usuario: string; estilos: Record<string, number>; tipo: string }[];
    historialTransferencias: { fecha: string; desde: string; hacia: string; estilos: Record<string, number>; tipo: string }[];
};

export function sheetToBeers(sheet: SheetData | null) {
    if (!sheet) return [];
    const cfg = sheet.configuracion || {};
    const catMap: Record<string, import('@/types/beers').BeerCategory> = {
        BLONDE: 'rubias',
        HONEY: 'rubias',
        STOUT: 'negras',
        'IRISH RED': 'rojas',
        'RED IPA': 'rojas',
        'SESSION IPA': 'ipa',
    };
    // ponytail: tagline/abv/ibu no existen en Sheet → placeholder; upgrade si Configuracion los agrega
    return Object.entries(sheet.stockGeneral)
        .filter(([k]) => k !== 'LATAS SIN ETIQUETA')
        .map(([estilo, stock]) => {
            const isLup = estilo.includes('IPA');
            return {
                id: estilo.toLowerCase().replace(/\s+/g, '-'),
                name: estilo,
                tagline: `Estilo ${estilo} — artesanal`,
                category: catMap[estilo] || 'rubias',
                abv: 5.0,
                ibu: 20,
                price: Number(cfg.precioMinorista) || 3500,
                priceMin: Number(cfg.precioMinorista) || 3500,
                priceMay: Number(isLup ? cfg.precioMayoristaLupulada : cfg.precioMayoristaNormal) || 2400,
                priceSix: Number(cfg.precioSixPack) || 3250,
                priceDoce: Number(cfg.precioDocePack) || 3000,
                style: estilo,
                stock: Number(stock) || 0,
                imageSrc: '/beers/blonde-removebg-preview.png',
            } as import('@/types/beers').Beer & { stock: number };
        });
}
