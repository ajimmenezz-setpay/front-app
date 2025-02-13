import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { CollapseDrawerProvider, SettingsProvider } from '@theme/context'
import GlobalStyles from '@theme/overrides/components/GlobalStyles'
import { es } from 'date-fns/locale'
import { RouterProvider } from 'react-router-dom'

import { LoadingLogo } from './shared/components/loadings'
import { useUser } from './shared/hooks'

import { AppRouter } from '@/routes'
import { MotionLazyContainer } from '@/shared/components/animate'
import { NotistackProvider } from '@/shared/components/notifications'
import { CustomTheme } from '@/theme'

import './App.css'

function App() {
  const user = useUser()
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <SettingsProvider>
        <CollapseDrawerProvider>
          <CustomTheme>
            <NotistackProvider>
              <MotionLazyContainer>
                <GlobalStyles />
                <RouterProvider
                  router={AppRouter(user)}
                  fallbackElement={<LoadingLogo />}
                  future={{
                    // Wrap all state updates in React.startTransition()
                    v7_startTransition: true
                  }}
                />
              </MotionLazyContainer>
            </NotistackProvider>
          </CustomTheme>
        </CollapseDrawerProvider>
      </SettingsProvider>
    </LocalizationProvider>
  )
}

export default App
