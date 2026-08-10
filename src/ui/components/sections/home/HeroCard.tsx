export function HeroCard() {
    return (
        <div className="relative flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-brand-earth/15 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="h-64 bg-stone-100 rounded-2xl flex items-center justify-center border border-dashed border-stone-300">
                    <span className="font-display text-stone-400 text-lg">
                        [ Ilustración Cerveza / Sol ]
                    </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <div>
                        <p className="font-display font-bold text-brand-earth text-lg">Golden Ale del Sol</p>
                        <p className="font-body text-xs text-stone-500">ABV: 4.8% | IBUs: 18</p>
                    </div>
                    <span className="px-3 py-1 bg-brand-green/10 text-brand-green font-bold text-xs rounded-full">
                        Lote Activo
                    </span>
                </div>
            </div>
        </div>
    )
}