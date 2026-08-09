import Image from 'next/image';

export function BeerTriangleGroup() {
    return (
        <div className="relative w-full max-w-md h-[400px] flex items-center justify-center">
            {/* Lata 1: Fondo Izquierda*/}
            <div className="absolute top-4 left-10 w-40 h-64 z-10 transition-transform duration-300 hover:z-30 hover:scale-110">
                <Image
                    src="/beers/blonde-removebg-preview.png"
                    alt="Golden Ale"
                    fill
                    className="object-contain drop-shadow-lg"
                />
            </div>

            {/* Lata 2: Fondo Derecha */}
            <div className="absolute top-4 right-10 w-40 h-64 z-10 transition-transform duration-300 hover:z-30 hover:scale-110">
                <Image
                    src="/beers/honey-removebg-preview.png"
                    alt="IPA Solaria"
                    fill
                    className="object-contain drop-shadow-lg"
                />
            </div>

            {/* Lata 3: Frente Centro */}
            <div className="absolute top-12 z-20 w-48 h-72 scale-105 transition-transform duration-300 hover:scale-115">
                <Image
                    src="/beers/sessionipa-removebg-preview.png"
                    alt="Red Honey"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                />
            </div>
        </div>
    );
}