import { useEffect } from 'react'

import { useAuth } from '@/shared/hooks'
import { useSettings } from '@/theme/hooks'

export const useLightThemeOnMount = () => {
  const { logout: logoutContext } = useAuth()
  const { themeMode, onChangeMode } = useSettings()

  useEffect(() => {
    if (themeMode !== 'light') {
      onChangeMode({
        target: {
          value: 'light'
        }
      })
    }
    logoutContext()
  }, [])
}
