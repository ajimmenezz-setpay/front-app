import { useState } from 'react'

import { AddBusiness, MoreVertTwoTone } from '@mui/icons-material'
import { IconButton, MenuItem, Tooltip } from '@mui/material'
import { useSnackbar } from 'notistack'

import { useAssignCardStore } from '@/app/management/stock-cards/store'
import { MenuPopover } from '@/shared/components/containers'

export function StockCardMenu({ card }) {
  const isReadyToAssign = useAssignCardStore(state => state.isReadyToAssign)
  const setOpenAssignCards = useAssignCardStore(state => state.setOpen)
  const setCard = useAssignCardStore(state => state.setCard)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { enqueueSnackbar } = useSnackbar()
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAssignCard = () => {
    if (isReadyToAssign) {
      setOpenAssignCards(true)
      setCard(card)
    } else {
      setOpenAssignCards(false)
      enqueueSnackbar(`Por el momento no se puede asignar la tarjeta. No hay comercios disponibles`, {
        variant: 'warning',
        autoHideDuration: 5000
      })
    }
  }

  return (
    <>
      <Tooltip title="Acciones">
        <IconButton
          onClick={handleClick}
          sx={{ ml: 2 }}
          aria-controls={open ? 'card-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVertTwoTone width={20} height={20} />
        </IconButton>
      </Tooltip>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-start"
        sx={{
          mt: -1,
          mr: 0,
          p: 2,
          width: 250,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
            '& svg': { mr: 2, width: 20, height: 20 }
          }
        }}
      >
        <MenuItem
          onClick={() => {
            handleAssignCard()
            handleClose()
          }}
          sx={{ color: 'text.secondary' }}
        >
          <AddBusiness width={24} height={24} />
          Asignar a Comercio
        </MenuItem>
      </MenuPopover>
    </>
  )
}
