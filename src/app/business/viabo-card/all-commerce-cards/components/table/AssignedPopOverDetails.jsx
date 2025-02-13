import { memo } from 'react'

import PropTypes from 'prop-types'

import { Popover, Stack, Typography } from '@mui/material'

const AssignedPopOverDetails = ({ open, anchorEl, handlePopoverClose, data }) => {
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
      <Stack spacing={2} p={2}>
        <Stack spacing={0.5} flex={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Nombre (s):
          </Typography>
          <Typography variant="body2">{data?.assignUser?.name ?? '-'}</Typography>
        </Stack>

        <Stack spacing={0.5} flex={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Apellidos:
          </Typography>
          <Typography variant="body2">{data?.assignUser?.lastName ?? '-'}</Typography>
        </Stack>

        <Stack spacing={0.5} flex={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Teléfono:
          </Typography>
          <Typography variant="body2">{data?.assignUser?.phone ?? '-'}</Typography>
        </Stack>
      </Stack>
    </Popover>
  )
}

AssignedPopOverDetails.propTypes = {
  anchorEl: PropTypes.any,
  data: PropTypes.shape({
    assignUser: PropTypes.shape({
      lastName: PropTypes.string,
      name: PropTypes.string,
      phone: PropTypes.string
    })
  }),
  handlePopoverClose: PropTypes.any,
  open: PropTypes.any
}

export default memo(AssignedPopOverDetails)
