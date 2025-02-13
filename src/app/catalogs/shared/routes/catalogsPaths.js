import { path } from '@/routes'

export const ROOT = '/catalogs'

export const CATALOGS_ROUTES_NAMES = {
  root: { route: 'catalogs', name: 'Catálogos' },
  causes: { route: 'causes', name: 'Causas' }
}

export const CATALOGS_PATHS = {
  root: ROOT,
  causes: path(ROOT, `/${CATALOGS_ROUTES_NAMES.causes.route}`)
}
