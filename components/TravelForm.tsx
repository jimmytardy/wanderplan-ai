'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Chip,
  Grid,
  Paper,
  Typography,
  Divider,
  Slider,
  Alert,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fr } from 'date-fns/locale'

interface TravelFormProps {
  onSubmit: (data: any) => void
  loading?: boolean
}

export function TravelForm({ onSubmit, loading }: TravelFormProps) {
  const [destinationQuery, setDestinationQuery] = useState('')
  const [destinations, setDestinations] = useState<any[]>([])
  const [selectedDestination, setSelectedDestination] = useState<any>(null)
  const [loadingDestinations, setLoadingDestinations] = useState(false)

  // Critères de base
  const [duration, setDuration] = useState(5)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [travelType, setTravelType] = useState('')
  const [theme, setTheme] = useState('')
  const [budget, setBudget] = useState('')

  // Critères activités
  const [preferredActivities, setPreferredActivities] = useState<string[]>([])
  const [activitiesToAvoid, setActivitiesToAvoid] = useState<string[]>([])
  const [activityIntensity, setActivityIntensity] = useState('')
  const [activityBudget, setActivityBudget] = useState('')
  const [accessibility, setAccessibility] = useState({
    handicap: false,
    enfants: false,
    animaux: false,
  })

  // Critères restauration
  const [restaurantType, setRestaurantType] = useState<string[]>([])
  const [mealBudget, setMealBudget] = useState('')
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [restaurantAmbiance, setRestaurantAmbiance] = useState('')

  // Critères logistiques
  const [transport, setTransport] = useState<string[]>([])
  const [maxDistance, setMaxDistance] = useState(10)
  const [preferredTime, setPreferredTime] = useState<string[]>([])
  const [weatherPreference, setWeatherPreference] = useState('')

  // Recherche de destinations avec debounce
  useEffect(() => {
    if (destinationQuery.length < 2) {
      setDestinations([])
      return
    }

    const timer = setTimeout(() => {
      searchDestinations(destinationQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [destinationQuery])

  const searchDestinations = async (query: string) => {
    setLoadingDestinations(true)
    try {
      const response = await fetch(`/api/destinations/search?q=${encodeURIComponent(query)}&limit=10`)
      const data = await response.json()
      if (data.success) {
        setDestinations(data.data)
      }
    } catch (error) {
      console.error('Error searching destinations:', error)
    } finally {
      setLoadingDestinations(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDestination) {
      alert('Veuillez sélectionner une destination')
      return
    }

    const formData = {
      destinationId: selectedDestination.id,
      duration,
      startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
      endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
      travelType: travelType || undefined,
      theme: theme || undefined,
      budget: budget || undefined,
      preferredActivities: preferredActivities.length > 0 ? preferredActivities : undefined,
      activitiesToAvoid: activitiesToAvoid.length > 0 ? activitiesToAvoid : undefined,
      activityIntensity: activityIntensity || undefined,
      activityBudget: activityBudget || undefined,
      accessibility: Object.values(accessibility).some(v => v) ? accessibility : undefined,
      restaurantType: restaurantType.length > 0 ? restaurantType : undefined,
      mealBudget: mealBudget || undefined,
      dietaryPreferences: dietaryPreferences.length > 0 ? dietaryPreferences : undefined,
      restaurantAmbiance: restaurantAmbiance || undefined,
      transport: transport.length > 0 ? transport : undefined,
      maxDistance: maxDistance || undefined,
      preferredTime: preferredTime.length > 0 ? preferredTime : undefined,
      weatherPreference: weatherPreference || undefined,
    }

    onSubmit(formData)
  }

  const activityOptions = [
    'Randonnée', 'Visites culturelles', 'Musées', 'Plages', 'Parcs d\'attraction',
    'Shopping', 'Sport', 'Nature', 'Art', 'Histoire', 'Architecture', 'Gastronomie'
  ]

  const restaurantTypeOptions = ['local', 'international', 'vegan', 'gastronomique', 'street-food']
  const dietaryOptions = ['vegetarien', 'halal', 'casher', 'sans-gluten', 'sans-lactose']
  const transportOptions = ['velo', 'voiture', 'marche', 'transports-communs']
  const timeOptions = ['matin', 'apres-midi', 'soir', 'journee-complete']

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          {/* Critères de base */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                1️⃣ Critères de base
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Autocomplete
                options={destinations}
                loading={loadingDestinations}
                getOptionLabel={(option) => option.label || option.name || ''}
                value={selectedDestination}
                onChange={(_, newValue) => setSelectedDestination(newValue)}
                inputValue={destinationQuery}
                onInputChange={(_, newInputValue) => setDestinationQuery(newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Destination *"
                    placeholder="Recherchez une destination..."
                    required
                  />
                )}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Durée (jours) *"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 5)}
                    inputProps={{ min: 1, max: 30 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de début"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date de fin"
                    value={endDate}
                    onChange={setEndDate}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type de voyage</InputLabel>
                    <Select
                      value={travelType}
                      onChange={(e) => setTravelType(e.target.value)}
                      label="Type de voyage"
                    >
                      <MenuItem value="familial">Familial</MenuItem>
                      <MenuItem value="romantique">Romantique</MenuItem>
                      <MenuItem value="entre-amis">Entre amis</MenuItem>
                      <MenuItem value="solo">Solo</MenuItem>
                      <MenuItem value="business">Business</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Thème</InputLabel>
                    <Select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      label="Thème"
                    >
                      <MenuItem value="culture">Culture</MenuItem>
                      <MenuItem value="nature">Nature</MenuItem>
                      <MenuItem value="sport">Sport</MenuItem>
                      <MenuItem value="gastronomie">Gastronomie</MenuItem>
                      <MenuItem value="luxe">Luxe</MenuItem>
                      <MenuItem value="detente">Détente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Budget global"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Ex: 1000€, 500-1000€"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Critères activités */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                2️⃣ Critères pour activités
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Autocomplete
                multiple
                options={activityOptions}
                value={preferredActivities}
                onChange={(_, newValue) => setPreferredActivities(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Activités préférées" placeholder="Sélectionnez..." />
                )}
                sx={{ mb: 2 }}
              />

              <Autocomplete
                multiple
                options={activityOptions}
                value={activitiesToAvoid}
                onChange={(_, newValue) => setActivitiesToAvoid(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Activités à éviter" placeholder="Sélectionnez..." />
                )}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Niveau d'intensité</InputLabel>
                    <Select
                      value={activityIntensity}
                      onChange={(e) => setActivityIntensity(e.target.value)}
                      label="Niveau d'intensité"
                    >
                      <MenuItem value="relax">Relax</MenuItem>
                      <MenuItem value="modere">Modéré</MenuItem>
                      <MenuItem value="intense">Intense</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Budget par activité</InputLabel>
                    <Select
                      value={activityBudget}
                      onChange={(e) => setActivityBudget(e.target.value)}
                      label="Budget par activité"
                    >
                      <MenuItem value="gratuit">Gratuit</MenuItem>
                      <MenuItem value="economique">Économique</MenuItem>
                      <MenuItem value="moyen">Moyen</MenuItem>
                      <MenuItem value="premium">Premium</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>Accessibilité</Typography>
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={accessibility.handicap}
                          onChange={(e) =>
                            setAccessibility({ ...accessibility, handicap: e.target.checked })
                          }
                        />
                      }
                      label="Handicap"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={accessibility.enfants}
                          onChange={(e) =>
                            setAccessibility({ ...accessibility, enfants: e.target.checked })
                          }
                        />
                      }
                      label="Enfants"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={accessibility.animaux}
                          onChange={(e) =>
                            setAccessibility({ ...accessibility, animaux: e.target.checked })
                          }
                        />
                      }
                      label="Animaux acceptés"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Critères restauration */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                3️⃣ Critères pour restauration
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Autocomplete
                multiple
                options={restaurantTypeOptions}
                value={restaurantType}
                onChange={(_, newValue) => setRestaurantType(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Type de restaurant" placeholder="Sélectionnez..." />
                )}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Budget par repas</InputLabel>
                    <Select
                      value={mealBudget}
                      onChange={(e) => setMealBudget(e.target.value)}
                      label="Budget par repas"
                    >
                      <MenuItem value="petit">Petit</MenuItem>
                      <MenuItem value="moyen">Moyen</MenuItem>
                      <MenuItem value="eleve">Élevé</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Ambiance</InputLabel>
                    <Select
                      value={restaurantAmbiance}
                      onChange={(e) => setRestaurantAmbiance(e.target.value)}
                      label="Ambiance"
                    >
                      <MenuItem value="familiale">Familiale</MenuItem>
                      <MenuItem value="romantique">Romantique</MenuItem>
                      <MenuItem value="animee">Animée</MenuItem>
                      <MenuItem value="calme">Calme</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={dietaryOptions}
                    value={dietaryPreferences}
                    onChange={(_, newValue) => setDietaryPreferences(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip label={option} {...getTagProps({ index })} key={option} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Préférences alimentaires" placeholder="Sélectionnez..." />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Critères logistiques */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                4️⃣ Critères logistiques
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Autocomplete
                multiple
                options={transportOptions}
                value={transport}
                onChange={(_, newValue) => setTransport(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Transport préféré" placeholder="Sélectionnez..." />
                )}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Distance maximale entre activités: {maxDistance} km
                  </Typography>
                  <Slider
                    value={maxDistance}
                    onChange={(_, value) => setMaxDistance(value as number)}
                    min={1}
                    max={50}
                    step={1}
                    marks={[
                      { value: 1, label: '1km' },
                      { value: 25, label: '25km' },
                      { value: 50, label: '50km' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    multiple
                    options={timeOptions}
                    value={preferredTime}
                    onChange={(_, newValue) => setPreferredTime(newValue)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip label={option} {...getTagProps({ index })} key={option} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Horaires préférés" placeholder="Sélectionnez..." />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Météo préférée</InputLabel>
                    <Select
                      value={weatherPreference}
                      onChange={(e) => setWeatherPreference(e.target.value)}
                      label="Météo préférée"
                    >
                      <MenuItem value="ensoleille">Ensoleillé</MenuItem>
                      <MenuItem value="pluie-possible">Pluie possible</MenuItem>
                      <MenuItem value="neige">Neige</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading || !selectedDestination}
              sx={{ py: 1.5, mt: 2 }}
            >
              {loading ? 'Génération en cours...' : 'Générer mon programme de voyage'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  )
}
