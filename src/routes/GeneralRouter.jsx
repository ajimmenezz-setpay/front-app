import { lazy } from 'react'

import { PATH_DASHBOARD } from '@/routes/paths'
import { Lodable } from '@/shared/components/lodables'

const GlobalCardDetails = Lodable(lazy(() => import('@/app/business/dashboard-master/pages/DashboardMaster')))
const FundingOrders = Lodable(lazy(() => import('@/app/business/funding-orders/pages/FundingOrders')))
const ExpensesControl = Lodable(lazy(() => import('@/app/business/expenses-control/pages/ExpensesControl')))

export const GeneralRouter = [
  {
    path: PATH_DASHBOARD['dashboard-master'],
    Component: GlobalCardDetails
  },
  {
    path: PATH_DASHBOARD['funding-orders'],
    Component: FundingOrders
  },
  {
    path: PATH_DASHBOARD['expenses-control'],
    Component: ExpensesControl
  },
  {
    path: PATH_DASHBOARD['my-account'],
    lazy: async () => {
      const { MyAccount } = await import('@/app/authentication/user-account/pages/MyAccount')
      return { Component: MyAccount }
    }
  }
]
