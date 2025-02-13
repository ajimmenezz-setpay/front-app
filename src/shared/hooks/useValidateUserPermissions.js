import { useMemo } from 'react'

function validateUserPermission(userPermissions, routesAndActions, path) {
  for (const key in routesAndActions) {
    if (routesAndActions[key]) {
      const action = Object.values(routesAndActions[key]).find(
        route => userPermissions?.includes(route?.permission) || route?.permission === true
      )
      if (action) {
        return true
      }
    }
  }

  return false
}

export const useValidateUserModulesAndPermissions = (modules, pathname, permissionsPaths) => {
  const isInPermissions = useMemo(() => {
    if (!modules?.permissions) {
      return false
    }
    return validateUserPermission(modules?.permissions ?? [], permissionsPaths, pathname)
  }, [modules, permissionsPaths, pathname])

  const canAccessModule = useMemo(
    () =>
      Boolean(
        modules?.menu
          ?.flatMap(category => category.modules.flatMap(module => [module, ...(module.modules || [])]))
          ?.find(module => {
            const modulePath = module?.path?.toLowerCase()
            const currentPath = pathname?.toLowerCase()

            // Verificar coincidencia exacta o ruta hija directa
            const exactMatch = currentPath === modulePath
            const childRouteMatch = new RegExp(`^${modulePath}/[^/]+$`).test(currentPath)

            return exactMatch || childRouteMatch
          })
      ),
    [pathname, modules]
  )
  return {
    canAccess: canAccessModule || isInPermissions
  }
}
