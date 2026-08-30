import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gordon-machinery-solutions.nikol777.chatgpt.site'),
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
    title: 'Heavy Equipment You Can Count On.',
    description: 'Sales, rentals and equipment sourcing for contractors throughout Atlanta and beyond.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Heavy Equipment You Can Count On — Sales, Rentals, Equipment Sourcing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heavy Equipment You Can Count On.',
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
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
