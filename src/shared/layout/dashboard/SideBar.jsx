import { Fragment, useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { Box, Icon, Stack, Tooltip, Typography, alpha, useTheme } from '@mui/material'
import { Menu, MenuItem, Sidebar, SubMenu, menuClasses, sidebarClasses } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom'

import CollapseButtonNew from './navbar/CollapseButtonNew'

import { FullLogo, Logo } from '@/shared/components/images'
import { useAuth } from '@/shared/hooks'
import { getActive } from '@/shared/layout/dashboard/nav-section'

const SideBar = ({ isCollapse, toggled, setToggled, setCollapsed }) => {
  const { user } = useAuth()
  const menu = useMemo(() => user?.menu || [], [user])
  const muiTheme = useTheme()
  const [broken, setBroken] = useState(window.matchMedia('(max-width: 1200px)').matches)
  const [rtl, setRtl] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const { pathname } = useLocation()

  const menuItemStyles = {
    root: {
      fontSize: muiTheme.typography.subtitle2.fontSize,
      fontWeight: 400
    },

    icon: {
      color: muiTheme.palette.primary.main,
      [`&.${menuClasses.disabled}`]: {
        color: muiTheme.palette.action.disabled
      },
      [`&.${menuClasses.active}`]: {
        color: muiTheme.palette.primary.main
      }
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9'
    },
    subMenuContent: ({ level }) => ({
      // borderRadius: muiTheme.shape.borderRadius,
      zIndex: muiTheme.zIndex.modal - 1,

      paddingBottom: 0,
      backgroundColor: level === 0 ? (isCollapse ? muiTheme.palette.background.paper : 'inherit') : 'inherit'
    }),
    button: ({ level, active, disabled }) => ({
      color: muiTheme.palette.text.primary,
      // marginBottom: '8px',

      ...(level >= 1 && {
        margin: muiTheme.spacing(1),
        borderRadius: muiTheme.shape.borderRadius,
        padding: 0,
        paddingLeft: 8
      }),

      [`&.${menuClasses.disabled}`]: {
        color: muiTheme.palette.action.disabled
      },
      '&:hover': {
        backgroundColor:
          muiTheme.palette.mode === 'dark'
            ? alpha(muiTheme.palette.action.hover, 1)
            : alpha(muiTheme.palette.action.hover, muiTheme.palette.action.hoverOpacity),
        color: muiTheme.palette.text.primary
        // '>span': {
        //   color: muiTheme.palette.primary.main
        // }
      },
      ...(active && {
        color: level === 0 ? muiTheme.palette.common.white : 'inherit',
        fontWeight: 600,
        backgroundColor: level === 0 ? alpha(muiTheme.palette.secondary.main, 0.9) : 'inherit'
      })
    }),
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined
    })
  }

  return (
    <Sidebar
      collapsed={isCollapse}
      toggled={toggled}
      onBackdropClick={() => {
        setToggled(false)
        setCollapsed(true)
      }}
      onBreakPoint={setBroken}
      rtl={rtl}
      customBreakPoint="1200px"
      width="280px"
      transitionDuration={500}
      style={{ height: '100vH' }}
      rootStyles={{
        color: muiTheme.palette.text.primary,
        zIndex: `${muiTheme.zIndex.drawer}!important`,
        borderColor: toggled ? 'none' : 'rgba(145, 158, 171, 0.24)',
        borderRightStyle: toggled ? 'none' : 'dashed',
        backgroundColor: toggled ? muiTheme.palette.background.default : 'inherit',
        ...(true &&
          muiTheme.palette.mode === 'light' && {
            backgroundColor: muiTheme.palette.background.neutral
          }),

        [`.${sidebarClasses.container}`]: {
          backgroundColor: toggled ? muiTheme.palette.background.default : 'inherit'
        }
      }}
    >
      <Stack height={'100dvH'}>
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
            {!isCollapse ? <FullLogo sx={{ width: 110 }} /> : <Logo />}
          </Stack>
        </Stack>
        <div style={{ flex: 1, marginBottom: '32px' }}>
          {menu?.map((menu, index) => (
            <Fragment key={index}>
              {!isCollapse && (
                <div style={{ padding: '0 24px', marginBottom: '8px' }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    style={{ opacity: isCollapse ? 0 : 0.7, letterSpacing: '0.5px' }}
                  >
                    {menu?.category}
                  </Typography>
                </div>
              )}
              <Menu
                style={{ marginBottom: !isCollapse ? muiTheme.spacing(2) : 0 }}
                menuItemStyles={menuItemStyles}
                closeOnClick
              >
                {menu?.modules?.map((module, index) => {
                  const active = getActive(module?.path, pathname)
                  const activeSubmenu = module?.modules?.some(submenu => getActive(submenu?.path, pathname))
                  if (!module?.modules) {
                    return (
                      <Tooltip key={module?.name} title={isCollapse ? module?.name : null} placement="right" arrow>
                        <div>
                          <MenuItem
                            active={active}
                            onClick={() => {
                              if (broken) {
                                setToggled(false)
                              }
                            }}
                            component={<Link to={module?.path} />}
                            icon={<Icon>{module?.icon && module?.icon}</Icon>}
                          >
                            {module?.name}
                          </MenuItem>
                        </div>
                      </Tooltip>
                    )
                  }
                  return (
                    <Tooltip
                      key={module?.name}
                      title={isCollapse && openSubmenu !== module?.name ? module?.name : null}
                      placement="bottom"
                      followCursor
                      arrow
                    >
                      <div>
                        <SubMenu
                          label={module?.name}
                          icon={<Icon>{module?.icon && module?.icon}</Icon>}
                          active={activeSubmenu}
                          onClick={() => {
                            setOpenSubmenu(module?.name)
                          }}
                          onBlur={() => setOpenSubmenu(null)}
                          defaultOpen={false}
                        >
                          {module?.modules?.map((submenu, index) => {
                            const active = getActive(submenu?.path, pathname)
                            return (
                              <MenuItem
                                onBlur={() => setOpenSubmenu(null)}
                                onClick={() => {
                                  setOpenSubmenu(null)
                                  if (broken) {
                                    setToggled(false)
                                  }
                                }}
                                key={submenu?.name}
                                component={<Link to={submenu?.path} />}
                                active={active}
                                title={submenu?.name}
                                icon={
                                  <Box
                                    component="span"
                                    sx={{
                                      width: active ? 6 : 4,
                                      height: active ? 6 : 4,
                                      borderRadius: '50%',
                                      bgcolor: active ? 'success.main' : 'text.disabled'
                                    }}
                                  />
                                }
                              >
                                {submenu?.name}
                              </MenuItem>
                            )
                          })}
                        </SubMenu>
                      </div>
                    </Tooltip>
                  )
                })}
              </Menu>
            </Fragment>
          ))}
        </div>
      </Stack>

      {!broken && <CollapseButtonNew onToggleCollapse={() => setCollapsed(prev => !prev)} isCollapse={isCollapse} />}
    </Sidebar>
  )
}

SideBar.propTypes = {
  isCollapse: PropTypes.any,
  setCollapsed: PropTypes.func,
  setToggled: PropTypes.func,
  toggled: PropTypes.any
}

export default SideBar
