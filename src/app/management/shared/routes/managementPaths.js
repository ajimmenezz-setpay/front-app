import { path } from '@/routes'

export const MANAGEMENT_ROUTES_NAMES = {
  root: { route: 'management', name: 'Administración' },
  stock_cards: { route: 'stock-cards', name: 'Stock de Tarjetas' },
  commerces: { route: 'commerces', name: 'Comercios' },
  users: { route: 'users', name: 'Usuarios' }
}

const ROOT = `/${MANAGEMENT_ROUTES_NAMES.root.route}/`

export const MANAGEMENT_PATHS = {
  root: ROOT,
  stock_cards: path(ROOT, `${MANAGEMENT_ROUTES_NAMES.stock_cards.route}`),
  commerces: path(ROOT, `${MANAGEMENT_ROUTES_NAMES.commerces.route}`),
  users: path(ROOT, `${MANAGEMENT_ROUTES_NAMES.users.route}`)
}
