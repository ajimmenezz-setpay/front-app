import { path } from '@/routes'

export const CARD_CLOUD_ROUTES = {
  root: { route: 'card-cloud', name: 'Card Cloud' },
  cards: { route: 'cards', name: 'Tarjetas' },
  stockCards: { route: 'stock-cards', name: 'Stock de Tarjetas' },
  dailyReport: { route: 'daily-report', name: 'Reporte Consumos Diarios' },
  cardsReport: { route: 'cards-report', name: 'Reporte Tarjetas' },
  fundingReport: { route: 'funding-report', name: 'Reporte Fondeos' }
}

const ROOT = `/${CARD_CLOUD_ROUTES.root.route}`

export const CARD_CLOUD_PATHS = {
  root: ROOT,
  cards: path(ROOT, `/${CARD_CLOUD_ROUTES.cards.route}`),
  stockCards: path(ROOT, `/${CARD_CLOUD_ROUTES.stockCards.route}`),
  dailyReport: path(ROOT, `/${CARD_CLOUD_ROUTES.dailyReport.route}`),
  cardsReport: path(ROOT, `/${CARD_CLOUD_ROUTES.cardsReport.route}`),
  fundingReport: path(ROOT, `/${CARD_CLOUD_ROUTES.fundingReport.route}`),
  card: (cardId, subAccountId) =>
    path(ROOT, `/cards/${encodeURIComponent(cardId)}?s=${encodeURIComponent(subAccountId)}`)
}
