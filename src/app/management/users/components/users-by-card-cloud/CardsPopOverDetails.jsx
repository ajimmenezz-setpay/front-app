import { memo } from 'react'

import { Chip, Divider, ListItem, Popover, Stack } from '@mui/material'

const CardsPopOverDetails = ({ open, anchorEl, handlePopoverClose, data }) => {
  if (!data) {
    return null
  }

  return (
    <Popover
      id="mouse-cards-over-popover"
      sx={{
        pointerEvents: 'none'
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left'
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            overflow: 'inherit',
            boxShadow: theme => theme.customShadows.z20,
            border: theme => `solid 1px ${theme.palette.grey[500_8]}`,
            width: 200
          }
        }
      }}
    >
      <Stack
        component={'ul'}
        gap={1}
        p={2}
        divider={<Divider orientation="horizontal" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        {data?.map(card => (
          <ListItem key={card?.id}>
            <Chip label={card?.number?.hidden} />
          </ListItem>
        ))}
      </Stack>
    </Popover>
  )
}

export default memo(CardsPopOverDetails)
