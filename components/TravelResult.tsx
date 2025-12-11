'use client'

import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
  Alert,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface TravelResultProps {
  result: any
  onReset: () => void
}

export function TravelResult({ result, onReset }: TravelResultProps) {
  const program = result.program

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
          {result.title || program?.title}
        </Typography>
        {result.fromCache && (
          <Chip
            icon={<CheckCircleIcon />}
            label="Depuis le cache"
            color="success"
            size="small"
          />
        )}
      </Box>

      {result.fromCache && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Ce programme a été trouvé dans notre base de données. Aucune génération IA n'a été nécessaire.
        </Alert>
      )}

      {program?.days && program.days.length > 0 ? (
        <Box>
          {program.days.map((day: any, index: number) => (
            <Accordion key={index} defaultExpanded={index === 0} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Jour {day.day} {day.date && `- ${new Date(day.date).toLocaleDateString('fr-FR')}`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* Activités */}
                  {day.activities && day.activities.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <DirectionsWalkIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Activités
                        </Typography>
                      </Box>
                      {day.activities.map((activity: any, actIndex: number) => (
                        <Box key={actIndex} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {activity.name}
                            </Typography>
                            {activity.time && (
                              <Chip label={activity.time} size="small" color="primary" />
                            )}
                          </Box>
                          {activity.duration && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Durée: {activity.duration}
                          </Typography>
                          )}
                          {activity.description && (
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {activity.description}
                            </Typography>
                          )}
                          {activity.location && (
                            <Typography variant="body2" color="text.secondary">
                              📍 {activity.location}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Grid>
                  )}

                  {/* Restaurants */}
                  {day.restaurants && day.restaurants.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <RestaurantIcon sx={{ mr: 1, color: 'secondary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Restaurants
                        </Typography>
                      </Box>
                      {day.restaurants.map((restaurant: any, restIndex: number) => (
                        <Box key={restIndex} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {restaurant.name}
                            </Typography>
                            {restaurant.time && (
                              <Chip label={restaurant.time} size="small" color="secondary" />
                            )}
                          </Box>
                          {restaurant.cuisine && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {restaurant.cuisine}
                            </Typography>
                          )}
                          {restaurant.priceRange && (
                            <Chip label={restaurant.priceRange} size="small" sx={{ mr: 1 }} />
                          )}
                          {restaurant.address && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              📍 {restaurant.address}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Conseils */}
          {program.tips && program.tips.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                💡 Conseils pratiques
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {program.tips.map((tip: string, index: number) => (
                  <Typography key={index} component="li" variant="body1" sx={{ mb: 1 }}>
                    {tip}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {/* Budget */}
          {program.budget && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                💰 Budget estimé
              </Typography>
              <Typography variant="body1">{program.budget}</Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Aucun programme disponible
        </Typography>
      )}

      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" onClick={onReset}>
          Créer un nouveau programme
        </Button>
        <Button variant="outlined" onClick={() => window.print()}>
          Imprimer
        </Button>
      </Box>
    </Paper>
  )
}
