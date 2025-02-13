import { useMemo } from 'react'

import PropTypes from 'prop-types'

import { CssBaseline, StyledEngineProvider, ThemeProvider, alpha, createTheme, styled } from '@mui/material'
import { useSettings } from '@theme/hooks/useSettings'
import { ComponentsOverrides } from '@theme/overrides/components'
import { breakpoints, customShadows, palette, shadows, typography } from '@theme/overrides/options'
import { ToastContainer, Zoom } from 'react-toastify'

const StyledToastContainer = styled(ToastContainer)(({ theme }) => ({
  '& .Toastify__toast': {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius
  },
  '& .Toastify__close-button': {
    color: theme.palette.text.primary
  }
}))
export const CustomTheme = ({ children }) => {
  const { themeMode, themeDirection } = useSettings()
  const isLight = themeMode === 'light'

  const customPalette = useMemo(() => palette, [palette])

  const customShadowsByCustomPalette = useMemo(() => customShadows(customPalette), [customPalette])

  const themeOptions = useMemo(
    () => ({
      palette: isLight ? customPalette.light : customPalette.dark,
      typography,
      breakpoints,
      shape: { borderRadius: 8 },
      direction: themeDirection,
      shadows: isLight ? shadows.light : shadows.dark,
      customShadows: isLight ? customShadowsByCustomPalette.light : customShadowsByCustomPalette.dark,
      unstable_sxConfig: {
        borderColor: alpha('#CFDBD5', 0.7)
      }
    }),
    [isLight, themeDirection, customPalette]
  )

  const theme = createTheme(themeOptions)

  // theme = responsiveFontSizes(theme);

  theme.components = ComponentsOverrides(theme)

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <StyledToastContainer
          theme={theme}
          position="top-center"
          transition={Zoom}
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          stacked
        />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

CustomTheme.propTypes = {
  children: PropTypes.node
}
