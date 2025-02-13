import { path } from '@/routes'

export const ROOT = '/support'

export const SUPPORT_ROUTES_NAMES = {
  root: { route: 'support', name: 'Soporte' },
  incidences: { route: 'incidences', name: 'Incidencias & Consultas' }
}

export const SUPPORT_PATHS = {
  root: ROOT,
  incidences: path(ROOT, `/${SUPPORT_ROUTES_NAMES.incidences.route}`)
}
