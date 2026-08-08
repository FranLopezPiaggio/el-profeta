import type { Config } from 'tailwindcss';

const config: Config = {
    theme: {
        extend: {
            fontFamily: {
                display: ['var(--font-display)', 'sans-serif'],
                body: ['var(--font-body)', 'sans-serif'],
            },
            colors: {
                // Sugerencia de paleta tierra/dorados usando sintaxis de Tailwind
                brand: {
                    green: '#2d5a27',
                    gold: '#e5a93c',
                    earth: '#78350f',
                }
            }
        },
    },
};
export default config;