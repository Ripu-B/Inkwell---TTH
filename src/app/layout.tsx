import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Homemade_Apple, Caveat, Liu_Jian_Mao_Cao, Indie_Flower, Zeyada } from 'next/font/google';

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

export const metadata: Metadata = {
  title: 'Inkwell',
  description: 'Digital to analog document simulator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${homemadeApple.variable} ${caveat.variable} ${liuJianMaoCao.variable} ${indieFlower.variable} ${zeyada.variable}`}>{children}</body>
    </html>
  );
} 