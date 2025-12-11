import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Providers } from '../providers'
import '../globals.css'
import { locales } from '@/i18n'

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Valider la locale
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Charger les messages pour la locale
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

