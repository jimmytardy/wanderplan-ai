'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

interface AdminPanelProps {
  token: string
  onLogout: () => void
}

export function AdminPanel({ token, onLogout }: AdminPanelProps) {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [saveForSeo, setSaveForSeo] = useState(false)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoSlug, setSeoSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/ai-configurable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          systemPrompt: systemPrompt || undefined,
          saveForSeo: saveForSeo && seoTitle && seoSlug,
          seoTitle: saveForSeo ? seoTitle : undefined,
          seoSlug: saveForSeo ? seoSlug : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur')
      }

      setResult(data.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Chip
        icon={<AdminPanelSettingsIcon />}
        label="Admin"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ cursor: 'pointer' }}
      />
      <Button
        startIcon={<LogoutIcon />}
        onClick={onLogout}
        sx={{ ml: 1 }}
        size="small"
      >
        Déconnexion
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>IA Configurable (Admin)</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            placeholder="Décris ce que tu veux générer..."
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Prompt système (optionnel)"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Rôle de l'IA..."
          />
          <Box sx={{ mb: 2 }}>
            <input
              type="checkbox"
              checked={saveForSeo}
              onChange={(e) => setSaveForSeo(e.target.checked)}
              id="save-seo"
            />
            <label htmlFor="save-seo" style={{ marginLeft: 8 }}>
              Sauvegarder pour SEO
            </label>
          </Box>
          {saveForSeo && (
            <>
              <TextField
                fullWidth
                label="Titre SEO"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Slug"
                value={seoSlug}
                onChange={(e) => setSeoSlug(e.target.value)}
                placeholder="mon-article-seo"
              />
            </>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Résultat:
              </Typography>
              <Box
                component="pre"
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: 400,
                }}
              >
                {result.content}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Fermer</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !prompt}
          >
            {loading ? <CircularProgress size={20} /> : 'Générer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
