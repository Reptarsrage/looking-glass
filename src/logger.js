const isDevelopment = process.env.NODE_ENV === 'development'
const hasConsole = typeof window === 'object' && Boolean(window.console)
const mockLogger = {
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  log: () => {},
}

const logger = isDevelopment && hasConsole ? window.console : mockLogger
export default logger
