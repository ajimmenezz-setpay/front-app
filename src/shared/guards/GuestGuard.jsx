import { useEffect, useMemo } from 'react'

import PropTypes from 'prop-types'

import { useSettings } from '@theme/hooks'
import { Navigate } from 'react-router-dom'

import { AUTHENTICATION_KEYS } from '@/app/authentication/shared/adapters'
import { useAuth, useGetQueryData } from '@/shared/hooks'

GuestGuard.propTypes = {
  children: PropTypes.node
}

export function GuestGuard({ children }) {
  const { isAuthenticated, user } = useAuth()
  const { themeMode, onChangeMode } = useSettings()
  const lastPath = localStorage.getItem('lastPath')
  const modules = useGetQueryData([AUTHENTICATION_KEYS.USER_MODULES])

  const existsLastPath = useMemo(
    () =>
      Boolean(
        modules?.menu
          ?.flatMap(category => category.modules)
          .find(module => module.path.toLowerCase() === lastPath?.toLowerCase())
      ),
    [lastPath, modules]
  )

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

  if (isAuthenticated) {
    const url = existsLastPath ? lastPath : user?.urlInit
    return <Navigate to={url} replace />
  }

  return <>{children}</>
}
