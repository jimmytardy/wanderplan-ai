import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Générateur de Voyages IA | Planifiez votre voyage personnalisé',
  description: 'Créez votre programme de voyage personnalisé en quelques clics grâce à l\'intelligence artificielle. Destinations, activités, restaurants et conseils pratiques.',
  keywords: 'voyage, planification, IA, générateur de voyage, programme voyage, destination',
  authors: [{ name: 'Voyage Generator' }],
  openGraph: {
    title: 'Générateur de Voyages IA',
    description: 'Créez votre programme de voyage personnalisé avec l\'IA',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

