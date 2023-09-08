import type { Config } from 'tailwindcss';

const config: Config = {
   content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}'
   ],
   theme: {
      extend: {
         maxHeight: {
            '36rem': '36rem'
         },
         fontFamily: {
            sans: ['var(--font-poiret)'],
            mono: ['var(--font-monoton)']
         }
      }
   },
   plugins: []
};
export default config;
