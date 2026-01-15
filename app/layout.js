import { Inter, Cormorant_Garamond} from 'next/font/google';
import Navigation from '@/components/layout/Navigation';
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-cormorant',
});

export const metadata = {
  title: 'Mark Farinas - Portfolio',
  description: 'Computer Science meets Immunology - Building solutions at the intersection of health and technology',
  keywords: 'Mark Farinas, Computer Science, Immunology, Bioinformatics, Health Tech, MacEwan University, University of Alberta',
  authors: [{ name: 'Mark Farinas' }],
  openGraph: {
    title: 'Mark Farinas - CS × Immunology Portfolio',
    description: 'Bridging biology and code through innovative projects and research.',
    url: 'https://markfarinas.com',
    siteName: 'Mark Farinas Portfolio',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans min-h-screen bg-[#f6f5f1]">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
