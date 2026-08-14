import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: 'WHALESS GROUP | Bespoke Automotive Customization & Corporate Solutions UAE',
  description:
    'WHALESS GROUP represents the pinnacle of luxury vehicle customization, precision tuning, ceramic protection, and executive solutions in Ras Al Khaimah and across the UAE.',
  metadataBase: new URL('https://www.walessgroup.ae'),
  alternates: {
    canonical: 'https://www.walessgroup.ae',
  },
  openGraph: {
    title: 'WHALESS GROUP | Luxury Automotive & Corporate Solutions UAE',
    description:
      'Ultra-luxury bespoke vehicle customization, high-performance tuning, ceramic protection, and executive services in Ras Al Khaimah, UAE.',
    url: 'https://www.walessgroup.ae',
    siteName: 'WHALESS GROUP',
    images: [
      {
        url: '/uploads/home_page.jpg',
        width: 1200,
        height: 630,
        alt: 'WHALESS GROUP Luxury Automobile Customization',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WHALESS GROUP',
    description: 'Bespoke Automotive & Corporate Solutions in Ras Al Khaimah, UAE.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-black text-white font-sans antialiased selection:bg-brand-green selection:text-black min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
