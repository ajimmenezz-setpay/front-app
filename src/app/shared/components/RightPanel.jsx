import PropTypes from 'prop-types'

import { Close } from '@mui/icons-material'
import { Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'

import { useResponsive } from '@/theme/hooks'

RightPanel.propTypes = {
  children: PropTypes.node,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  titleElement: PropTypes.node,
  width: PropTypes.any
}

export function RightPanel({
  open = false,
  handleClose,
  title,
  children,
  titleElement,
  width = { sm: '100%', lg: '40%', xl: '30%' }
}) {
  const matches = useResponsive('down', 'md')

  const handleDrawerClose = event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    handleClose()
  }

  return (
    <Drawer
      keepMounted={false}
      anchor={matches ? 'bottom' : 'right'}
      sx={{
        '& .MuiPaper-root.MuiDrawer-paper': {
          borderRadius: `${!matches ? '10px 0px 0px 10px' : 'none'}`,
          width
        }
      }}
      open={open}
      onClose={handleDrawerClose}
      ModalProps={{
        keepMounted: false
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
        {titleElement || <Typography variant="h6">{title}</Typography>}

        <div>
          <IconButton aria-label="close" size="medium" onClick={handleClose}>
            <Close width={20} height={20} fontSize="inherit" color="primary" />
          </IconButton>
        </div>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />
      {children}
    </Drawer>
  )
}
