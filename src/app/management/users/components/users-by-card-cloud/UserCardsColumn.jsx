import { useState } from 'react'

import { Add } from '@mui/icons-material'
import { Box, Chip, Typography } from '@mui/material'

import CardsPopOverDetails from './CardsPopOverDetails'

export const UserCardsColumn = ({ row }) => {
  const [firstCard, ...restCards] = row?.cards?.list || []
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <CardsPopOverDetails
        anchorEl={anchorEl}
        open={open}
        handlePopoverClose={handlePopoverClose}
        data={row?.cards?.list || []}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 1
        }}
      >
        {firstCard ? (
          <Chip size="small" label={firstCard?.number?.hidden} />
        ) : (
          <Typography variant="caption">Sin tarjetas</Typography>
        )}

        {restCards && restCards?.length > 0 && (
          <Chip
            aria-owns={open ? 'mouse-cards-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={event => {
              handlePopoverOpen(event)
            }}
            onMouseLeave={handlePopoverClose}
            variant="outlined"
            label={restCards?.length || 0}
            size="small"
            icon={<Add sx={{ width: 12, height: 12 }} />}
          />
        )}
      </Box>
    </>
  )
}
