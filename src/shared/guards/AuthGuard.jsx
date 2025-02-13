import { useEffect } from 'react'

import PropTypes from 'prop-types'

import { useSettings } from '@theme/hooks'
import { Navigate, useLocation } from 'react-router-dom'

import { PERMISSIONS_PATHS } from '../../routes'

import { AUTHENTICATION_KEYS } from '@/app/authentication/shared/adapters'
import { PATH_AUTH } from '@/routes'
import { LoadingLogo } from '@/shared/components/loadings'
import { useAuth, useGetQueryData, useValidateUserModulesAndPermissions } from '@/shared/hooks'

AuthGuard.propTypes = {
  children: PropTypes.node
}

export function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized, isFetchingModules } = useAuth()
  const { pathname } = useLocation()
  const { themeMode, onChangeMode } = useSettings()

  const modules = useGetQueryData([AUTHENTICATION_KEYS.USER_MODULES])

  const { canAccess } = useValidateUserModulesAndPermissions(modules, pathname, PERMISSIONS_PATHS)

  const loading = isFetchingModules

  useEffect(() => {
    const dashboardMode = localStorage.getItem('dashboardTheme')
    if (dashboardMode && themeMode !== dashboardMode) {
      onChangeMode({
        target: {
          value: dashboardMode
        }
      })
    }

    if (!dashboardMode) {
      onChangeMode({
        target: {
          value: 'light'
        }
      })
    }
  }, [])

  if (isAuthenticated && canAccess) {
    localStorage.setItem('lastPath', pathname)
  }

  if (!isInitialized || loading) {
    return <LoadingLogo />
  }

  if (!isAuthenticated) {
    return <Navigate to={PATH_AUTH.login} />
  }

  if (!canAccess && pathname !== '/') {
    return <Navigate to={'/404'} />
  }

  return <>{children}</>
}
