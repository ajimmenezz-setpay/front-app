import { useState } from 'react'

import PropTypes from 'prop-types'

import { AccountBalance, Contactless, NorthEast, SouthWest } from '@mui/icons-material'
import { Avatar, Box, Stack, Typography } from '@mui/material'

import MovementPopOverDetails from './MovementPopOverDetails'

import { getCardTypeByName } from '@/app/shared/services'

const MovementDescriptionColumn = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const isIncome = row?.type === 'ingreso'
  const isViaboPay = row?.type === 'terminal'
  const cardLogo = getCardTypeByName(row?.paymentProcessor)
  const CardLogoComponent = cardLogo?.component
  return (
    <>
      <MovementPopOverDetails anchorEl={anchorEl} open={open} handlePopoverClose={handlePopoverClose} data={row} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: 1
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            sx={{
              width: 30,
              height: 30,
              color: 'text.secondary',
              bgcolor: 'background.neutral'
            }}
          >
            {cardLogo ? (
              <CardLogoComponent sx={{ width: 21, height: 21 }} />
            ) : isViaboPay ? (
              <Contactless color="primary" sx={{ width: 21, height: 21 }} />
            ) : (
              <AccountBalance sx={{ width: 21, height: 21 }} />
            )}
          </Avatar>
          <Box
            sx={{
              right: 0,
              bottom: 0,
              width: 12,
              height: 12,
              display: 'flex',
              borderRadius: '50%',
              position: 'absolute',
              alignItems: 'center',
              color: 'common.white',
              bgcolor: 'error.main',
              justifyContent: 'center',
              ...((isIncome || isViaboPay) && {
                bgcolor: 'success.main'
              })
            }}
          >
            {isIncome || isViaboPay ? (
              <SouthWest sx={{ width: 8, height: 8 }} />
            ) : (
              <NorthEast sx={{ width: 8, height: 8 }} />
            )}
          </Box>
        </Box>
        <Stack
          sx={{ ml: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 1 }}
          onMouseEnter={event => {
            handlePopoverOpen(event)
          }}
          onMouseLeave={handlePopoverClose}
        >
          <Typography
            variant="caption"
            noWrap
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: 1
            }}
          >
            {row?.description}
          </Typography>
        </Stack>
      </Box>
    </>
  )
}

MovementDescriptionColumn.propTypes = {
  row: PropTypes.shape({
    concept: PropTypes.string,
    description: PropTypes.any,
    paymentProcessor: PropTypes.any,
    type: PropTypes.string
  })
}

export default MovementDescriptionColumn
