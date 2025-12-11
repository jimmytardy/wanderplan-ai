import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'WanderPlan AI | Planifiez votre voyage personnalisé',
  description: 'Créez votre programme de voyage personnalisé en quelques clics grâce à l\'intelligence artificielle. Destinations, activités, restaurants et conseils pratiques.',
  keywords: 'voyage, planification, IA, générateur de voyage, programme voyage, destination, wanderplan',
  authors: [{ name: 'WanderPlan AI' }],
  openGraph: {
    title: 'WanderPlan AI',
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

