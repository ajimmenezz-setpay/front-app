import { lazy } from 'react'

import { Navigate } from 'react-router-dom'

import { MANAGEMENT_ROUTES_NAMES } from '@/app/management/shared/routes/managementPaths'
import { Lodable } from '@/shared/components/lodables'

const ManagementCommerces = Lodable(lazy(() => import('@/app/management/commerces/pages/ManagementCommerces')))
const StockCards = Lodable(lazy(() => import('@/app/management/stock-cards/pages/StockCards')))
export const ManagementRouter = {
  path: MANAGEMENT_ROUTES_NAMES.root.route,
  children: [
    { index: true, path: '/management', element: <Navigate to="/404" /> },
    {
      path: MANAGEMENT_ROUTES_NAMES.commerces.route,
      element: <ManagementCommerces />
    },
    {
      path: MANAGEMENT_ROUTES_NAMES.stock_cards.route,
      element: <StockCards />
    },
    {
      path: MANAGEMENT_ROUTES_NAMES.users.route,
      lazy: async () => {
        const { ManagementUsers } = await import('../../users/pages/ManagementUsers')
        return { Component: ManagementUsers }
      }
    }
  ]
}
