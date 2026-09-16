import type { Metadata } from 'next';
import { Archivo, IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';
import { siteUrl } from './lib/site-url';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: 'Gordon Machinery Solutions | Heavy Equipment Sales & Rentals',
  description:
    'Quality used construction equipment, flexible rentals, and equipment sourcing for contractors throughout Atlanta and beyond.',
  applicationName: 'Gordon Machinery Solutions',
  keywords: [
    'heavy equipment Atlanta',
    'used construction equipment',
    'equipment rentals Georgia',
    'equipment sourcing',
  ],
  icons: {
    icon: 'https://www.gordonmachinerysolutions.com/favicon.ico',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Gordon Machinery Solutions',
    title: 'Used Heavy Equipment for Sale and Rent.',
    description: 'Sales, rentals and equipment sourcing for contractors throughout Atlanta and beyond.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Gordon Machinery Solutions — Sales, Rentals and Equipment Sourcing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Used Heavy Equipment for Sale and Rent.',
    description: 'Sales, rentals and equipment sourcing for contractors throughout Atlanta and beyond.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${archivo.variable} ${ibmPlexMono.variable}`}>{children}</body>
    </html>
  );
}
