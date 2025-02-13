import { lazy, Suspense, useState } from 'react'

import { Menu } from '@mui/icons-material'
import { AppBar, Box, CssBaseline, IconButton, Stack, Toolbar } from '@mui/material'
import { useCollapseDrawer, useResponsive } from '@theme/hooks'
import { Outlet, ScrollRestoration } from 'react-router-dom'

import { ThemeMode } from './header'
import AccountPopover from './header/AccountPopover'
import News from './header/News'
import SideBar from './SideBar'

import { TicketSupport } from '@/app/support/new-ticket-support/pages/TicketSupport'
import { cssStyles } from '@/theme/utils'

const ChangePassword = lazy(() => import('@/app/authentication/user-change-password/components/ChangePassword'))
const TwoAuthDrawer = lazy(() => import('@/app/authentication/2FA/components/TwoAuthDrawer'))

export function DashboardLayout() {
  const isDesktop = useResponsive('up', 'lg')

  const { isCollapse, onToggleCollapse, setCollapse } = useCollapseDrawer()

  const [open, setOpen] = useState(false)

  return (
    <>
      <Box sx={{ display: 'flex', height: '100dvH' }}>
        <CssBaseline />
        <SideBar toggled={open} setToggled={setOpen} isCollapse={isCollapse} setCollapsed={onToggleCollapse} />
        <Stack sx={{ overflow: 'auto', flexGrow: 1 }}>
          <AppBar
            position="sticky"
            component="nav"
            sx={theme => ({
              ...cssStyles(theme).bgBlur(),
              boxShadow: 'none',
              backgroundColor: 'inherit'
            })}
          >
            <Toolbar sx={{ pl: '0px!important' }}>
              {!isDesktop && (
                <IconButton
                  sx={{
                    mx: 1,
                    color: 'text.primary'
                  }}
                  onClick={() => {
                    setOpen(true)
                    setCollapse(false)
                  }}
                >
                  <Menu />
                </IconButton>
              )}

              <Box sx={{ flexGrow: 1 }}>{isDesktop && <News />}</Box>

              <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 2 }}>
                <TicketSupport />
                <ThemeMode />
                <AccountPopover />
              </Stack>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{ pb: 3, position: 'relative', height: '100%' }}>
            <Outlet />
          </Box>
        </Stack>
        <ScrollRestoration />
      </Box>
      <Suspense>
        <ChangePassword />
      </Suspense>
      <Suspense>
        <TwoAuthDrawer />
      </Suspense>
    </>
  )
}
