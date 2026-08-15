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
  title: 'WALESS GROUP | Bespoke Automotive Customization & Corporate Solutions UAE',
  description:
    'WALESS GROUP represents the pinnacle of luxury vehicle customization, precision tuning, ceramic protection, and executive solutions in Ras Al Khaimah and across the UAE.',
  metadataBase: new URL('https://walessgroup.ae'),
  alternates: {
    canonical: 'https://walessgroup.ae',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'WALESS GROUP | Luxury Automotive & Corporate Solutions UAE',
    description:
      'Ultra-luxury bespoke vehicle customization, high-performance tuning, ceramic protection, and executive services in Ras Al Khaimah, UAE.',
    url: 'https://walessgroup.ae',
    siteName: 'WALESS GROUP',
    images: [
      {
        url: '/uploads/home_page.jpg',
        width: 1200,
        height: 630,
        alt: 'WALESS GROUP Luxury Automobile Customization',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WALESS GROUP',
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
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-black text-white font-sans antialiased selection:bg-brand-green selection:text-black min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
