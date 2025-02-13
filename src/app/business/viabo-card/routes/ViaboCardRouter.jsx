import { lazy } from 'react'

import { Navigate } from 'react-router-dom'

import { VIABO_CARD_ROUTES_NAMES } from '@/app/business/viabo-card/routes/viabo-card-paths'
import { Lodable } from '@/shared/components/lodables'

const CommerceCards = Lodable(lazy(() => import('@/app/business/viabo-card/cards/pages/CommerceCards')))
const AllCommerceCards = Lodable(
  lazy(() => import('@/app/business/viabo-card/all-commerce-cards/pages/AllCommerceCards'))
)

export const ViaboCardRouter = {
  path: VIABO_CARD_ROUTES_NAMES.root.route,
  children: [
    { index: true, path: `/viabo-card`, element: <Navigate to="/404" /> },
    {
      path: VIABO_CARD_ROUTES_NAMES.cards.route,
      element: <CommerceCards />
    },
    {
      path: VIABO_CARD_ROUTES_NAMES.allCards.route,
      element: <AllCommerceCards />
    }
  ]
}
