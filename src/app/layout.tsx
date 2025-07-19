import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Homemade_Apple, Caveat, Liu_Jian_Mao_Cao, Indie_Flower, Zeyada, Crimson_Text, Shadows_Into_Light, Dancing_Script, Satisfy, Handlee, Gochi_Hand, Allura, Yellowtail, Parisienne } from 'next/font/google';

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

const shadowsIntoLight = Shadows_Into_Light({
  variable: "--font-shadows-into-light",
  weight: "400",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  weight: "400",
  subsets: ["latin"],
});

const handlee = Handlee({
  variable: "--font-handlee",
  weight: "400",
  subsets: ["latin"],
});

const gochiHand = Gochi_Hand({
  variable: "--font-gochi-hand",
  weight: "400",
  subsets: ["latin"],
});

const allura = Allura({
  variable: "--font-allura",
  weight: "400",
  subsets: ["latin"],
});

const yellowtail = Yellowtail({
  variable: "--font-yellowtail",
  weight: "400",
  subsets: ["latin"],
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  weight: "400",
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
      <body className={`${inter.className} ${homemadeApple.variable} ${caveat.variable} ${liuJianMaoCao.variable} ${indieFlower.variable} ${zeyada.variable} ${crimsonText.variable} ${shadowsIntoLight.variable} ${dancingScript.variable} ${satisfy.variable} ${handlee.variable} ${gochiHand.variable} ${allura.variable} ${yellowtail.variable} ${parisienne.variable}`}>{children}</body>
    </html>
  );
} 