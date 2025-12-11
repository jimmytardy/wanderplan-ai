'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material'
import { TravelForm } from '@/components/TravelForm'
import { TravelResult } from '@/components/TravelResult'
import { AdminPanel } from '@/components/AdminPanel'
import { LoginDialog } from '@/components/LoginDialog'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default function Home() {
  const t = useTranslations('Home')
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthToken(localStorage.getItem('adminToken'))
    }
  }, [])

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    setError(null)
    setResult(null)

    // Ajouter la langue dans les données
    const dataWithLocale = {
      ...formData,
      locale,
    }

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithLocale),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      setResult(data.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (token: string) => {
    setAuthToken(token)
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token)
    }
  }

  const handleLogout = () => {
    setAuthToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken')
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header SEO-friendly */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          🌍 {t('title')}
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'text.secondary',
            mb: 3,
          }}
        >
          {t('subtitle')}
        </Typography>
      </Box>

      {/* Admin Panel et Language Switcher */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <LanguageSwitcher />
        <Box>
          {authToken ? (
            <AdminPanel token={authToken} onLogout={handleLogout} />
          ) : (
            <Button variant="outlined" onClick={() => setLoginOpen(true)}>
              {t('adminLogin')}
            </Button>
          )}
        </Box>
      </Box>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />

      {/* Résultat */}
      {result && (
        <Box sx={{ mb: 3 }}>
          <TravelResult result={result} onReset={() => setResult(null)} />
        </Box>
      )}

      {/* Formulaire principal */}
      {!result && (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          }}
        >
          {/* Erreur */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Formulaire */}
          <TravelForm
            onSubmit={handleSubmit}
            loading={loading}
          />

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2, alignSelf: 'center' }}>
                {t('generating')}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Footer SEO */}
      <Box
        component="footer"
        sx={{
          mt: 6,
          py: 4,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('footer')}
        </Typography>
      </Box>
    </Container>
  )
}

