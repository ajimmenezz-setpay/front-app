import { LibraryAdd, PriceChange, Visibility } from '@mui/icons-material'
import { ListItemIcon, MenuItem } from '@mui/material'

import { useCommerce } from '../../store'

export function getCommerceActions(table) {
  const { row, closeMenu } = table
  const { original: rowData } = row
  const { status } = rowData
  const { setCommerce, setOpenCommerceDetails, setOpenCommerceCommissions, setOpenCommerceServices } = useCommerce(
    state => state
  )

  const menuItems = [
    <MenuItem
      key={'details'}
      onClick={() => {
        setCommerce(rowData)
        setOpenCommerceDetails(true)
        closeMenu()
      }}
      sx={{ m: 0 }}
    >
      <ListItemIcon>
        <Visibility color="info" />
      </ListItemIcon>
      Ver Detalles
    </MenuItem>,
    <MenuItem
      key="commissions"
      onClick={() => {
        setCommerce(rowData)
        setOpenCommerceCommissions(true)
        closeMenu()
      }}
      sx={{ m: 0 }}
    >
      <ListItemIcon>
        <PriceChange color="primary" />
      </ListItemIcon>
      Comisiones
    </MenuItem>,
    <MenuItem
      key="services"
      onClick={() => {
        setCommerce(rowData)
        setOpenCommerceServices(true)
        closeMenu()
      }}
      sx={{ m: 0 }}
    >
      <ListItemIcon>
        <LibraryAdd />
      </ListItemIcon>
      Servicios
    </MenuItem>
  ]

  return menuItems
}
