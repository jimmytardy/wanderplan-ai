/**
 * Système de logging simple pour le monitoring
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
}

/**
 * Log une entrée avec timestamp et niveau
 */
function log(level: LogLevel, message: string, data?: any) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  }

  // En production, on pourrait envoyer vers un service de logging
  // Pour l'instant, on log dans la console
  const logMessage = `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`
  
  switch (level) {
    case 'error':
      console.error(logMessage, data || '')
      break
    case 'warn':
      console.warn(logMessage, data || '')
      break
    case 'debug':
      if (process.env.NODE_ENV === 'development') {
        console.debug(logMessage, data || '')
      }
      break
    default:
      console.log(logMessage, data || '')
  }

  // TODO: En production, envoyer vers un service externe (Sentry, LogRocket, etc.)
}

export const logger = {
  info: (message: string, data?: any) => log('info', message, data),
  warn: (message: string, data?: any) => log('warn', message, data),
  error: (message: string, data?: any) => log('error', message, data),
  debug: (message: string, data?: any) => log('debug', message, data),
}

