import { memo } from 'react'

import PropTypes from 'prop-types'

import { Popover, Stack, Typography } from '@mui/material'

const MovementPopOverDetails = ({ open, anchorEl, handlePopoverClose, data }) => {
  if (!data) {
    return null
  }

  return (
    <Popover
      id="mouse-over-popover"
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
            mt: 1.5,
            ml: 0.5,
            overflow: 'inherit',
            boxShadow: theme => theme.customShadows.z20,
            border: theme => `solid 1px ${theme.palette.grey[500_8]}`,
            width: 200
          }
        }
      }}
    >
      <Stack spacing={1} p={2}>
        <Typography variant="body2">{data?.description}</Typography>

        {data?.concept !== '' && (
          <Typography variant="overline" color={'text.disabled'} fontStyle={'italic'} sx={{ textWrap: 'wrap' }}>
            concepto : {data?.concept}
          </Typography>
        )}
      </Stack>
    </Popover>
  )
}

MovementPopOverDetails.propTypes = {
  anchorEl: PropTypes.any,
  data: PropTypes.shape({
    concept: PropTypes.any,
    description: PropTypes.any
  }),
  handlePopoverClose: PropTypes.any,
  open: PropTypes.any
}

export default memo(MovementPopOverDetails)
