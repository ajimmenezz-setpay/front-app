import { Suspense } from 'react'

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SnackbarProvider } from 'notistack'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'

import { CustomTheme } from '@/theme'

export const cache = new Map()

function ThemeModeProvider({ children }) {
  return <CustomTheme>{children}</CustomTheme>
}

function Providers({ children }) {
  const Wrapper = (
    <Suspense fallback={null}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <QueryClientProvider client={new QueryClient()}>
          <ThemeModeProvider>
            <SnackbarProvider autoHideDuration={20} maxSnack={1}>
              <MemoryRouter>
                <HelmetProvider>{children}</HelmetProvider>
              </MemoryRouter>
            </SnackbarProvider>
          </ThemeModeProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </Suspense>
  )

  return Wrapper
}

function renderWithProviders(ui, options) {
  const rtl = render(ui, {
    wrapper: ({ children }) => <Providers>{children}</Providers>,
    ...options
  })

  return {
    ...rtl,
    rerender: (ui, rerenderOptions) =>
      renderWithProviders(ui, {
        container: rtl.container,
        ...options,
        ...rerenderOptions
      })
  }
}

export { screen } from '@testing-library/react'

export const queryWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export { renderWithProviders as render, userEvent as user }
