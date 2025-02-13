import { path } from '@/routes'

export const VIABO_CARD_ROUTES_NAMES = {
  root: { route: 'viabo-card', name: 'Viabo Card' },
  cards: { route: 'cards', name: 'Tarjetas' },
  globalCard: { route: 'cards/global', name: 'Tarjeta Global Comercio' },
  allCards: { route: 'stock-cards', name: 'Stock de Tarjetas' }
}

const ROOT = `/${VIABO_CARD_ROUTES_NAMES.root.route}/`

export const VIABO_CARD_PATHS = {
  root: ROOT,
  cards: path(ROOT, `${VIABO_CARD_ROUTES_NAMES.cards.route}`),
  globalCard: path(ROOT, `${VIABO_CARD_ROUTES_NAMES.globalCard.route}`),
  allCards: path(ROOT, `${VIABO_CARD_ROUTES_NAMES.allCards.route}`)
}
