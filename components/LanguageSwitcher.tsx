'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (event: any) => {
    const newLocale = event.target.value
    // Remplacer la locale dans l'URL
    const segments = pathname.split('/')
    if (segments[1] && ['fr', 'en', 'pt', 'es', 'it'].includes(segments[1])) {
      segments[1] = newLocale
    } else {
      segments.splice(1, 0, newLocale)
    }
    const newPathname = segments.join('/')
    router.push(newPathname)
    router.refresh()
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LanguageIcon />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Langue</InputLabel>
        <Select
          value={locale}
          onChange={handleChange}
          label="Langue"
        >
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="pt">Português</MenuItem>
          <MenuItem value="es">Español</MenuItem>
          <MenuItem value="it">Italiano</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

