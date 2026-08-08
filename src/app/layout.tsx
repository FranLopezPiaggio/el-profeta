import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';

const fontDisplay = Fredoka({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const fontBody = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'El Profeta Cervecería Artesanal',
  description: 'Cerveza fresca, sol y buenas vibras.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fontDisplay.variable} ${fontBody.variable}`}
    >
      <body className="min-h-[100dvh] flex flex-col font-body bg-stone-100 text-stone-800 antialiased selection:bg-amber-200">
        {/* Aquí irá tu Header global si la SPA lo requiere */}

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Aquí irá tu Footer global */}
      </body>
    </html>
  );
}