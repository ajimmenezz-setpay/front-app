import { useEffect } from 'react'

import PropTypes from 'prop-types'

import { Box, Drawer, Stack } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { useResponsive } from '@theme/hooks'
import { useCollapseDrawer } from '@theme/hooks/useCollapseDrawer'
import { NAVBAR } from '@theme/overrides/options'
import { cssStyles } from '@theme/utils'
import { useLocation } from 'react-router-dom'

import NavbarAccount from './NavbarAccount'

import { NavSectionVertical } from '../nav-section'

import { Logo } from '@/shared/components/images'
import { Scrollbar } from '@/shared/components/scroll'
import CollapseButtonNew from '@/shared/layout/dashboard/navbar/CollapseButtonNew'

const RootStyle = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter
    })
  }
}))

NavbarVertical.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
}

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }) {
  const theme = useTheme()

  const { pathname } = useLocation()

  const isDesktop = useResponsive('up', 'lg')

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } = useCollapseDrawer()

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const renderContent = (
    <>
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' })
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Logo />
        </Stack>
        {!isCollapse && <NavbarAccount isCollapse={isCollapse} />}
      </Stack>
      <Scrollbar
        sx={{
          height: 1,
          overflowX: 'hidden',
          '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' }
        }}
      >
        <NavSectionVertical isCollapse={isCollapse} />

        <Box sx={{ flexGrow: 1 }} />
      </Scrollbar>
    </>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      <RootStyle
        component={'nav'}
        sx={{
          width: {
            lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH
          },
          ...(collapseClick && {
            position: 'absolute'
          })
        }}
      >
        {isDesktop && (
          <CollapseButtonNew
            onToggleCollapse={onToggleCollapse}
            isCollapse={isCollapse}
            collapseClick={collapseClick}
          />
        )}

        {!isDesktop && (
          <Drawer open={isOpenSidebar} onClose={onCloseSidebar} PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}>
            {renderContent}
          </Drawer>
        )}

        {isDesktop && (
          <Drawer
            open
            variant="persistent"
            PaperProps={{
              sx: {
                width: NAVBAR.DASHBOARD_WIDTH,
                borderRightStyle: 'dashed',
                bgcolor: 'background.default',
                transition: theme =>
                  theme.transitions.create('width', {
                    duration: theme.transitions.duration.standard
                  }),
                ...(isCollapse && {
                  width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH
                }),
                ...(collapseHover && {
                  ...cssStyles(theme).bgBlur(),
                  boxShadow: theme => theme.customShadows.z24
                })
              }
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </RootStyle>
    </Box>
  )
}
