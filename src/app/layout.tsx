import type { Metadata } from 'next';
import {
  Fredoka,
  Nunito,
  Russo_One,
  Squada_One,
  Passion_One
} from 'next/font/google'; import { Navbar } from '@/ui/components/layout/Navbar';
import './globals.css';
import { AgeVerificationModal } from '@/ui/components/common/AgeVerification';
import { CartDrawer } from '@/ui/components/cart/CartDrawer';

// Fuentes Display (Titulares / Branding)
const fontFredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const fontRussoOne = Russo_One({
  subsets: ['latin'],
  variable: '--font-russo',
  weight: '400', // Russo One solo posee peso 400
  display: 'swap',
});

const fontSquadaOne = Squada_One({
  subsets: ['latin'],
  variable: '--font-squada',
  weight: '400',
  display: 'swap',
});

const fontPassionOne = Passion_One({
  subsets: ['latin'],
  variable: '--font-passion',
  weight: ['400', '700', '900'],
  display: 'swap',
});

// Fuente Body (Cuerpo y UI)
const fontNunito = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cervecería Artesanal',
  description: 'Cerveza fresca, sol y buenas vibras.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${fontFredoka.variable} ${fontRussoOne.variable} ${fontSquadaOne.variable} ${fontPassionOne.variable} ${fontNunito.variable}`}
    >
      <body className="min-h-[100dvh] flex flex-col text-stone-800 antialiased">
        {/* MODIFICACIÓN: <main> ahora es 100% libre a lo ancho */}
        <main className="flex-1 w-full">
          {children}
          <AgeVerificationModal />
          <CartDrawer />
        </main>
      </body>
    </html>
  );
}