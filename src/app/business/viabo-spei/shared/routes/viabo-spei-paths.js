import { path } from '@/routes'

export const VIABO_SPEI_ROUTES = {
  home: { route: '/', name: 'Inicio' },
  root: { route: 'spei-cloud', name: 'Spei Cloud' },
  dashboard: { route: 'dashboard', name: 'Dashboard' },
  companies: { route: 'companies', name: 'Empresas' },
  costCenters: { route: 'cost-centers', name: 'Centros de Costos' },
  spei_transfer: { route: 'spei-transfer', name: 'Transferir a SPEI' },
  billing_report: { route: 'billing-statement', name: 'Estado de Cuenta' },
  commissions_report: { route: 'commissions-statement', name: 'Reporte de Comisiones' }
}

const ROOT = `/${VIABO_SPEI_ROUTES.root.route}`

export const VIABO_SPEI_PATHS = {
  root: ROOT,
  dashboard: path(ROOT, `/${VIABO_SPEI_ROUTES.dashboard.route}`),
  companies: path(ROOT, `/${VIABO_SPEI_ROUTES.companies.route}`),
  costCenters: path(ROOT, `/${VIABO_SPEI_ROUTES.costCenters.route}`),
  spei_transfer: path(ROOT, `/${VIABO_SPEI_ROUTES.spei_transfer.route}`),
  billing_report: path(ROOT, `/${VIABO_SPEI_ROUTES.billing_report.route}`),
  commissions_report: path(ROOT, `/${VIABO_SPEI_ROUTES.commissions_report.route}`)
}
