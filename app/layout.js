import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mark Farinas - Portfolio',
  description: 'Computer Science meets Immunology - Building solutions at the intersection of health and technology',
  keywords: 'Mark Farinas, Computer Science, Immunology, Bioinformatics, Health Tech, MacEwan University, University of Alberta',
  authors: [{ name: 'Mark Farinas' }],
  openGraph: {
    title: 'Mark Farinas - CS × Immunology Portfolio',
    description: 'Bridging biology and code through innovative projects and research',
    url: 'https://markfarinas.com',
    siteName: 'Mark Farinas Portfolio',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
