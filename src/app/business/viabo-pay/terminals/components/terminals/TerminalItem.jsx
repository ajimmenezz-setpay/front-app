import PropTypes from 'prop-types'

import { ContactlessSharp, PointOfSale } from '@mui/icons-material'
import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Stack,
  Tooltip,
  Typography,
  styled
} from '@mui/material'

import { useTerminalDetails, useTerminals } from '../../store'

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  borderRadius: '8px!important',
  width: 1,
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
  mb: 1
  // transition: theme.transitions.create('all')
}))

export const TerminalItem = ({ terminal }) => {
  const isOpenSidebar = useTerminals(state => state.isOpenList)
  const setOpenSidebar = useTerminals(state => state.setOpenList)

  const setCommerceTerminal = useTerminalDetails(state => state.setTerminal)
  const commerceTerminal = useTerminalDetails(state => state.terminal)

  const status =
    terminal?.id === commerceTerminal?.id && commerceTerminal
      ? commerceTerminal?.cardON === true
        ? 'online'
        : 'offline'
      : 'invisible'

  const isSelected = terminal?.id === commerceTerminal?.id

  const handleSelectedRow = e => {
    const type = e.target?.type
    if (!type && !isSelected) {
      setCommerceTerminal(terminal)
    }
  }

  return (
    <Tooltip title={terminal?.name} arrow placement="right">
      <ListItem
        sx={{
          mb: 1,
          padding: 0,
          borderRadius: 1,
          '& :hover': { color: 'text.primary' }
        }}
        disablePadding
      >
        <RootStyle
          onClick={handleSelectedRow}
          sx={{
            ...(isSelected && {
              bgcolor: 'secondary.light',
              color: 'text.primary.contrastText',
              '& :hover': { color: 'text.primary' }
            }),
            '& :hover': { color: 'text.primary' },
            width: 1,
            py: 1,
            gap: 1
          }}
        >
          <ListItemAvatar sx={{ ml: 2, m: 0 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={theme => ({
                  width: 32,
                  height: 32,
                  m: 0,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '& :hover': { color: theme.palette.primary.contrastText }
                })}
              >
                {terminal?.isVirtual ? (
                  <ContactlessSharp
                    sx={theme => ({ width: 20, height: 20, '& :hover': { color: theme.palette.primary.contrastText } })}
                  />
                ) : (
                  <PointOfSale
                    sx={theme => ({
                      width: 16,
                      height: 16,
                      '& :hover': { color: theme.palette.primary.contrastText }
                    })}
                  />
                )}
              </Avatar>
            </Box>
          </ListItemAvatar>

          {isOpenSidebar && (
            <>
              <Stack
                sx={{
                  width: 1
                }}
              >
                <Typography noWrap variant={'subtitle2'}>
                  {terminal?.name}
                </Typography>
              </Stack>
            </>
          )}
        </RootStyle>
      </ListItem>
    </Tooltip>
  )
}

TerminalItem.propTypes = {
  terminal: PropTypes.shape({
    alias: PropTypes.any,
    id: PropTypes.any,
    isVirtual: PropTypes.any,
    name: PropTypes.any
  })
}
