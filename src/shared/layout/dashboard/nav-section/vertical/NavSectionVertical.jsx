import { useEffect, useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { Box, Collapse, Divider, List, ListItemButton } from '@mui/material'
import { styled } from '@mui/material/styles'

import { NavListRoot } from './NavList'
import { ListItemTextStyle } from './style'

import { AUTHENTICATION_KEYS } from '@/app/authentication/shared/adapters'
import { useAuth, useGetQueryData } from '@/shared/hooks'

export const ListSubheaderStyle = styled(props => <ListItemButton {...props} />)(({ theme }) => ({
  ...theme.typography.overline,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter
  })
}))

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array
}

function NavSectionVertical({ isCollapse, ...other }) {
  const { user } = useAuth()
  const data = useGetQueryData([AUTHENTICATION_KEYS.USER_MODULES]) ?? []
  const navConfig = data?.menu
  const initialState = useMemo(() => navConfig?.map(() => true), [navConfig])

  const [openStates, setOpenStates] = useState([])
  const [savedStates, setSavedStates] = useState(openStates)

  useEffect(() => {
    if (isCollapse && navConfig?.length > 0) {
      setOpenStates(initialState)
    }
    if (!isCollapse && navConfig?.length > 0) {
      const data = savedStates.length === 0 ? initialState : savedStates
      setOpenStates(data)
    }
  }, [initialState, isCollapse, navConfig, openStates, savedStates])

  const handleOpen = index => {
    setOpenStates(prevStates => {
      const newStates = [...openStates]
      newStates[index] = !openStates[index]
      return newStates
    })

    setSavedStates(prevStates => {
      const newStates = [...openStates]
      newStates[index] = !openStates[index]
      return newStates
    })
  }

  return (
    <Box {...other} sx={{ pb: 2 }}>
      {navConfig?.map((group, index) => {
        if (group?.category) {
          const open = Boolean(openStates && openStates[index])
          return (
            <List key={index} disablePadding sx={{ px: 2 }}>
              {!isCollapse && (
                <ListSubheaderStyle
                  sx={{
                    py: 1,
                    ...(isCollapse && {
                      opacity: 0
                    })
                  }}
                  onClick={() => {
                    handleOpen(index)
                  }}
                >
                  <ListItemTextStyle
                    primaryTypographyProps={{ variant: 'caption' }}
                    isCollapse={isCollapse}
                    primary={group.category}
                  />

                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListSubheaderStyle>
              )}
              {group?.modules.map((list, index) => (
                <Collapse key={index} in={open} timeout="auto">
                  <NavListRoot list={list} isCollapse={isCollapse} />
                </Collapse>
              ))}
              {isCollapse && index !== navConfig.length - 1 && <Divider sx={{ mb: 0.5 }} />}
            </List>
          )
        }
        return null
      })}
    </Box>
  )
}

export default NavSectionVertical
