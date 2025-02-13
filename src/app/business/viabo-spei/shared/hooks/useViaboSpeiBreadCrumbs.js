import { useMemo } from 'react'

import { VIABO_SPEI_PATHS, VIABO_SPEI_ROUTES } from '../routes/viabo-spei-paths'

export const useViaboSpeiBreadCrumbs = () => {
  const speiTransfer = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: VIABO_SPEI_ROUTES.root.name, href: VIABO_SPEI_PATHS.spei_transfer },
      { name: VIABO_SPEI_ROUTES.spei_transfer.name }
    ],
    [VIABO_SPEI_ROUTES, VIABO_SPEI_PATHS]
  )

  const companies = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: VIABO_SPEI_ROUTES.root.name, href: VIABO_SPEI_PATHS.companies },
      { name: 'Empresas' }
    ],
    [VIABO_SPEI_ROUTES, VIABO_SPEI_PATHS]
  )

  const costCenters = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: VIABO_SPEI_ROUTES.root.name, href: VIABO_SPEI_PATHS.costCenters },
      { name: 'Centro de Costos' }
    ],
    [VIABO_SPEI_ROUTES, VIABO_SPEI_PATHS]
  )

  const billingReport = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: VIABO_SPEI_ROUTES.root.name, href: VIABO_SPEI_PATHS.billing_report },
      { name: 'Estados de Cuenta' }
    ],
    [VIABO_SPEI_ROUTES, VIABO_SPEI_PATHS]
  )

  const commissionsReport = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: VIABO_SPEI_ROUTES.root.name, href: VIABO_SPEI_PATHS.commissions_report },
      { name: 'Reporte de Comisiones' }
    ],
    [VIABO_SPEI_ROUTES, VIABO_SPEI_PATHS]
  )

  return {
    speiTransfer,
    companies,
    costCenters,
    billingReport,
    commissionsReport
  }
}
