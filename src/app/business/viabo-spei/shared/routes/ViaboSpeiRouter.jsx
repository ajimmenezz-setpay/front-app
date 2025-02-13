import { Navigate } from 'react-router-dom'

import LocationConsentBanner from '../components/LocationConsentBanner'

const ViaboSpeiRouter = {
  path: 'spei-cloud',
  Component: LocationConsentBanner,
  children: [
    { index: true, path: 'spei-cloud', element: <Navigate to="/404" /> },
    {
      path: 'dashboard',
      lazy: async () => {
        const { AdminDashboardViaboSpei } = await import('../../dashboard/pages/AdminDashboardViaboSpei')
        return { Component: AdminDashboardViaboSpei }
      }
    },
    {
      path: 'spei-transfer',
      lazy: async () => {
        const { SpeiThirdAccounts } = await import('../../third-accounts/pages/SpeiThirdAccounts')
        return { Component: SpeiThirdAccounts }
      }
    },
    {
      path: 'companies',
      lazy: async () => {
        const { ViaboSpeiCompanies } = await import('../../companies/pages/ViaboSpeiCompanies')
        return { Component: ViaboSpeiCompanies }
      }
    },
    {
      path: 'cost-centers',
      lazy: async () => {
        const { ViaboSpeiCostCenters } = await import('../../cost-centers/pages/ViaboSpeiCostCenters')
        return { Component: ViaboSpeiCostCenters }
      }
    },
    {
      path: 'billing-statement',
      lazy: async () => {
        const { BillingReport } = await import('../../billing-report/pages/BillingReport')
        return { Component: BillingReport }
      }
    },
    {
      path: 'commissions-statement',
      lazy: async () => {
        const { CommissionsReport } = await import('../../commissions-report/pages/CommissionsReport')
        return { Component: CommissionsReport }
      }
    }
  ]
}

export default ViaboSpeiRouter
