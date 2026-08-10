export function TopGradientBubbles() {
    return (
        <section className="relative w-full h-28 bg-gradient-to-b from-brand-bone-white via-brand-gold/30 via-brand-gold/70 to-brand-gold">
            {/* Capa de la imagen de burbujas flotando por encima sin cortar el gradiente */}
            <div
                className="absolute inset-x-0 top-0 pointer-events-none z-10 
                           h-[200px] bg-[url('/cerveza1.png')] bg-repeat-x bg-top 
                           bg-[length:auto_60%] -translate-y-8"
            />
        </section>
    );
}