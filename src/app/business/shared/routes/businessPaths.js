import { BUSINESS_PERMISSIONS } from '@/app/business/shared/routes/businessPermissions'

export const BUSINESS_ROUTES_NAMES = {
  root: { route: 'commerce', name: 'Comercio' },
  cards: { route: 'cards', name: 'Tarjetas' },
  globalCard: { route: 'cards/global', name: 'Tarjeta Global Comercio', permission: BUSINESS_PERMISSIONS.GLOBAL_CARD },
  allCards: { route: 'stock-cards', name: 'Stock de Tarjetas' },
  terminals: { route: 'terminals', name: 'Pay' }
}
