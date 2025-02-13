import { useEffect } from 'react'

import { useSettings } from '@theme/hooks'
import { NAVBAR } from '@theme/overrides/options'

import { varFade } from '@/shared/components/animate'

export const useRightPanel = open => {
  const { themeDirection } = useSettings()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const varSidebar =
    themeDirection !== 'rtl'
      ? varFade({
          distance: NAVBAR.BASE_WIDTH,
          durationIn: 0.32,
          durationOut: 0.32
        }).inRight
      : varFade({
          distance: NAVBAR.BASE_WIDTH,
          durationIn: 0.32,
          durationOut: 0.32
        }).inLeft

  return { varSidebar }
}
