import PropTypes from 'prop-types'

import { Menu } from '@mui/icons-material'
import { AppBar, Box, IconButton, Stack, Toolbar } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useOffSetTop, useResponsive } from '@theme/hooks'
import { HEADER, NAVBAR } from '@theme/overrides/options'
import { cssStyles } from '@theme/utils'

import AccountPopover from './AccountPopover'

import { Logo } from '@/shared/components/images'
import { ThemeMode } from '@/shared/layout/dashboard/header/ThemeMode'

const RootStyle = styled(AppBar, {
  shouldForwardProp: prop => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout'
})(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: theme.palette.background.default
    })
  }
}))

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
  isCollapse: PropTypes.bool,
  verticalLayout: PropTypes.bool
}

export default function DashboardHeader({ onOpenSidebar, isCollapse = false, verticalLayout = false }) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout

  const isDesktop = useResponsive('up', 'lg')

  return (
    <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
      <Toolbar
        sx={{
          minHeight: '100% !important',
          px: { lg: 5 }
        }}
      >
        {isDesktop && verticalLayout && <Logo sx={{ mr: 2.5 }} />}

        {!isDesktop && (
          <IconButton
            sx={{
              mr: 1,
              color: 'text.primary'
            }}
            onClick={onOpenSidebar}
          >
            <Menu />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 2 }}>
          <ThemeMode />
          <AccountPopover />
        </Stack>
      </Toolbar>
    </RootStyle>
  )
}
