import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ALAMAR BEACH HOUSE — Villa de Lujo en Playa Blanca, San Antero',
  description:
    'Vive una experiencia VIP en nuestra villa exclusiva a 30 metros del mar. Piscina privada, jacuzzi, 4 habitaciones, vistas al océano en San Antero, Córdoba, Colombia.',
  keywords: [
    'villa lujo Colombia',
    'casa playa San Antero',
    'Playa Blanca Córdoba',
    'alquiler vacacional Colombia',
    'villa con piscina',
    'jacuzzi playa Colombia',
    'ALAMAR BEACH HOUSE',
  ],
  openGraph: {
    title: 'ALAMAR BEACH HOUSE — Villa de Lujo en Playa Blanca',
    description:
      'Descubre un refugio donde el mar, la calma y el confort se unen. Reserva tu experiencia VIP hoy.',
    type: 'website',
    locale: 'es_CO',
  },
}

export const viewport: Viewport = {
  themeColor: '#1B4D5C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
