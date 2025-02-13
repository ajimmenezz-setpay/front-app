import { memo } from 'react'

import PropTypes from 'prop-types'

import { Avatar, Box, ListItem, ListItemAvatar, ListItemButton, Stack, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { useCardsOfCardCloudStore } from '../../store'

import { MasterCardLogo } from '@/shared/components/images'
import { BadgeStatus } from '@/shared/components/notifications'
import { useResponsive } from '@/theme/hooks'

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  width: 1,
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
  mb: 1
  // transition: theme.transitions.create('all')
}))

CardItem.propTypes = {
  isOpen: PropTypes.bool,
  card: PropTypes.object
}

function CardItem({ isOpen, card }) {
  const status = card?.status?.isActive ? 'online' : 'offline'
  const setSelectedCard = useCardsOfCardCloudStore(state => state.setSelectedCard)
  const selectedCard = useCardsOfCardCloudStore(state => state.selectedCard)
  const setOpenSidebar = useCardsOfCardCloudStore(state => state.setOpenSidebar)
  const isOpenSidebar = useCardsOfCardCloudStore(state => state.isOpenSidebar)
  const setCollapse = useCardsOfCardCloudStore(state => state.setCollapse)
  const isCollapse = useCardsOfCardCloudStore(state => state.isCollapse)

  const isSelected = card?.id === selectedCard?.id
  const isDesktop = useResponsive('up', 'md')

  const handleSelectedRow = e => {
    if (!isSelected) {
      setSelectedCard(card)
      !isDesktop && isOpenSidebar && setOpenSidebar(false)
      isDesktop && !isCollapse && setCollapse(true)
    }
  }

  const text = card?.isAssigned ? `${card?.number?.hidden} - ${card?.userAssigned?.fullName}` : card?.number?.hidden

  return (
    <Tooltip title={!isOpen ? text : ''} arrow placement="right">
      <ListItem
        sx={{
          padding: 0,
          borderRadius: 0,
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
          <ListItemAvatar sx={{ m: 0 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={theme => ({
                  width: 30,
                  height: 30,
                  m: 0,
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.info.dark
                })}
              >
                <MasterCardLogo sx={{ width: 20 }} />
              </Avatar>
              <BadgeStatus status={status} sx={{ right: 0, bottom: 0, position: 'absolute' }} />
            </Box>
          </ListItemAvatar>

          {isOpen && (
            <>
              <Stack
                sx={{
                  width: 1
                }}
              >
                <Typography variant={'subtitle2'}>{text}</Typography>
              </Stack>
            </>
          )}
        </RootStyle>
      </ListItem>
    </Tooltip>
  )
}

export default memo(CardItem)
