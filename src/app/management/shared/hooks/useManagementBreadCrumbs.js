import { useMemo } from 'react'

import { MANAGEMENT_PATHS, MANAGEMENT_ROUTES_NAMES } from '../routes'

export const useManagementBreadCrumbs = () => {
  const users = useMemo(
    () => [
      { name: 'Inicio', href: '/' },
      { name: MANAGEMENT_ROUTES_NAMES.root.name, href: MANAGEMENT_PATHS.users },
      { name: MANAGEMENT_ROUTES_NAMES.users.name }
    ],
    [MANAGEMENT_PATHS, MANAGEMENT_ROUTES_NAMES]
  )

  return {
    users
  }
}
