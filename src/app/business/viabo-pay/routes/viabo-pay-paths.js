import { path } from '@/routes'

export const VIABO_PAY_ROUTES_NAMES = {
  root: { route: 'viabo-pay', name: 'Viabo Pay' },
  terminals: { route: 'terminals', name: 'Terminales' },
  cloud: { route: 'cloud', name: 'Nube' }
}

const ROOT = `/${VIABO_PAY_ROUTES_NAMES.root.route}/`

export const VIABO_PAY_PATHS = {
  root: ROOT,
  terminals: path(ROOT, `${VIABO_PAY_ROUTES_NAMES.terminals.route}`),
  cloud: path(ROOT, `${VIABO_PAY_ROUTES_NAMES.cloud.route}`)
}
