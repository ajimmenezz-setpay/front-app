import { DeleteForever } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'

import { useSpeiThirdAccounts } from '../store'

export function getSpeiThirdAccountsTableActions(table) {
  const { row, closeMenu } = table
  const { original: rowData } = row
  const { status } = rowData
  const { setOpenDeleteSpeiThirdAccount, setSpeiThirdAccount } = useSpeiThirdAccounts()

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: '8px'
      }}
    >
      {status && (
        <IconButton
          size="small"
          color="primary"
          title="Borrar"
          onClick={e => {
            e.stopPropagation()
            setSpeiThirdAccount(rowData)
            setOpenDeleteSpeiThirdAccount(true)
          }}
        >
          <DeleteForever color="error" size="small" titleAccess="Borrar" />
        </IconButton>
      )}
    </Box>
  )
}
