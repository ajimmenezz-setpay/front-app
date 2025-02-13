const VIABO_SPEI_PERMISSIONS = {
  DASHBOARD: 'MP-VIABO-SPEI',
  DASHBOARD_ADMIN: 'MP-VIABO-SPEI-ADMIN',
  DASHBOARD_COST_CENTERS: 'MP-VIABO-COST-CENTERS'
}

const SPEI_OUT_DESTINATION = {
  THIRD_ACCOUNTS: {
    id: 'third-accounts',
    name: 'Cuenta de Terceros',
    permission: null,
    default: true
  },
  COMPANIES: {
    id: 'companies',
    name: 'Empresas',
    permission: [VIABO_SPEI_PERMISSIONS.DASHBOARD_ADMIN, VIABO_SPEI_PERMISSIONS.DASHBOARD],
    default: false
  },
  CONCENTRATOR: {
    id: 'concentrator',
    name: 'Concentradora',
    permission: [VIABO_SPEI_PERMISSIONS.DASHBOARD],
    default: false
  }
}

const getSpeiOutOptionByPermissions = (permissions = []) =>
  Object.values(SPEI_OUT_DESTINATION).reduce((acc, option) => {
    if (option.permission === null || option.permission.some(permission => permissions.includes(permission))) {
      acc.push(option)
    }
    return acc
  }, [])

export { SPEI_OUT_DESTINATION, VIABO_SPEI_PERMISSIONS, getSpeiOutOptionByPermissions }
