import { useMemo } from 'react'

import { CARD_CLOUD_PATHS, CARD_CLOUD_ROUTES } from '../routes/card-cloud-paths'

export const useCardCloudBreadCrumbs = () => {
  const cards = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: CARD_CLOUD_ROUTES.root.name, href: CARD_CLOUD_PATHS.cards },
      { name: 'Tarjetas' }
    ],
    [CARD_CLOUD_ROUTES, CARD_CLOUD_PATHS]
  )

  const card = cardId =>
    useMemo(
      () => [
        { name: 'Inicio', href: '/' },
        { name: CARD_CLOUD_ROUTES.root.name, href: CARD_CLOUD_PATHS.cards },
        { name: 'Tarjetas', href: CARD_CLOUD_PATHS.cards },
        {
          name: cardId
        }
      ],
      [CARD_CLOUD_ROUTES, CARD_CLOUD_PATHS]
    )

  const stockCards = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: CARD_CLOUD_ROUTES.root.name, href: CARD_CLOUD_PATHS.stockCards },
      { name: 'Stock de Tarjetas' }
    ],
    [CARD_CLOUD_ROUTES, CARD_CLOUD_PATHS]
  )

  const dailyReport = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: CARD_CLOUD_ROUTES.root.name, href: CARD_CLOUD_PATHS.dailyReport },
      { name: 'Reporte Consumos Diarios' }
    ],
    [CARD_CLOUD_ROUTES, CARD_CLOUD_PATHS]
  )

  const cardsReport = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: CARD_CLOUD_ROUTES.root.name, href: CARD_CLOUD_PATHS.cardsReport },
      { name: 'Reporte Tarjetas' }
    ],
    [CARD_CLOUD_ROUTES, CARD_CLOUD_PATHS]
  )

  const fundingReport = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: CARD_CLOUD_ROUTES.root.name, href: CARD_CLOUD_PATHS.fundingReport },
      { name: 'Reporte Fondeos' }
    ],
    [CARD_CLOUD_ROUTES, CARD_CLOUD_PATHS]
  )

  return {
    cards,
    card,
    stockCards,
    dailyReport,
    cardsReport,
    fundingReport
  }
}
