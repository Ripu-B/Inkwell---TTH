import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Homemade_Apple, Caveat, Liu_Jian_Mao_Cao, Indie_Flower, Zeyada, Crimson_Text } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const homemadeApple = Homemade_Apple({
  variable: "--font-homemade-apple",
  weight: "400",
  subsets: ["latin"],
});
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});
const liuJianMaoCao = Liu_Jian_Mao_Cao({
  variable: "--font-liu-jian-mao-cao",
  weight: "400",
  subsets: ["latin"],
});
const indieFlower = Indie_Flower({
  variable: "--font-indie-flower",
  weight: "400",
  subsets: ["latin"],
});
const zeyada = Zeyada({
  variable: "--font-zeyada",
  weight: "400",
  subsets: ["latin"],
});
const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Inkwell',
  description: 'The most advanced text to handwriting tool.',
};

// Load Etna Sans Serif font
const loadEtnaSansSerif = () => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${homemadeApple.variable} ${caveat.variable} ${liuJianMaoCao.variable} ${indieFlower.variable} ${zeyada.variable} ${crimsonText.variable}`}>{children}</body>
    </html>
  );
} 