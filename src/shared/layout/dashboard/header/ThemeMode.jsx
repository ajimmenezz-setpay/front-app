import { DarkMode, LightMode } from '@mui/icons-material'
import { useSettings } from '@theme/hooks'

import { IconButtonAnimate } from '@/shared/components/animate'

export function ThemeMode() {
  const { themeMode, onChangeMode } = useSettings()

  const handleChangeMode = () => {
    const value = themeMode === 'light' ? 'dark' : 'light'
    onChangeMode({
      target: {
        value
      }
    })
    localStorage.setItem('dashboardTheme', value)
  }

  return (
    <IconButtonAnimate color="primary" sx={{ width: 30, height: 30 }} onClick={handleChangeMode}>
      {themeMode === 'light' ? <DarkMode /> : <LightMode />}
    </IconButtonAnimate>
  )
}
