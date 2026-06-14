import type { Metadata } from 'next';
import { Fredoka, Quicksand, Noto_Sans_Mono } from 'next/font/google';
import './globals.css';

const display = Fredoka({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Quicksand({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = Noto_Sans_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Scions - a breeding lineage on GenLayer',
  description:
    'Conjure primordial clay creatures from a seed, then breed any two. An on-chain AI Geneticist rules each cross under validator consensus, and a branching genealogy grows for everyone.',
  openGraph: {
    title: 'Scions',
    description:
      'Conjure primordials, breed them, and watch an on-chain AI Geneticist rule each cross under consensus on GenLayer Bradbury Testnet.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scions',
    description:
      'A breeding lineage where an on-chain AI Geneticist rules every cross under validator consensus.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
