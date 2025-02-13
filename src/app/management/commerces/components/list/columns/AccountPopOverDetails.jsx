import { memo } from 'react'

import PropTypes from 'prop-types'

import { Box, Popover, Stack, Typography } from '@mui/material'

import { Label } from '@/shared/components/form'

const AccountPopOverDetails = ({ open, anchorEl, handlePopoverClose, data }) => {
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
            Nombre:
          </Typography>
          <Typography variant="body2">{data?.name ?? '-'}</Typography>
        </Stack>

        <Stack spacing={0.5} flex={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Teléfono:
          </Typography>
          <Typography variant="body2">{data?.phone ?? '-'}</Typography>
        </Stack>

        <Stack spacing={0.5} flex={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Fecha Registro:
          </Typography>
          <Typography variant="body2">{data?.register ?? '-'}</Typography>
        </Stack>

        <Stack spacing={0.5} flex={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Último Inicio de Sesión:
          </Typography>
          <Typography variant="body2">{data?.lastLogged ?? '-'}</Typography>
        </Stack>

        <Stack spacing={0.5} flex={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Estado:
          </Typography>
          <Box>
            <Label
              variant={'ghost'}
              color={data?.status?.toLowerCase() === 'activo' ? 'success' : 'error'}
              sx={{
                textTransform: 'uppercase'
              }}
            >
              {data?.status ?? '-'}
            </Label>
          </Box>
        </Stack>
      </Stack>
    </Popover>
  )
}

AccountPopOverDetails.propTypes = {
  anchorEl: PropTypes.any,
  data: PropTypes.shape({
    lastLogged: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    register: PropTypes.string,
    status: PropTypes.string
  }),
  handlePopoverClose: PropTypes.any,
  open: PropTypes.any
}

export default memo(AccountPopOverDetails)
