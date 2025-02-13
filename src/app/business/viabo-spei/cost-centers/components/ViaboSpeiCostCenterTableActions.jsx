import { Edit } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'

import { useSpeiCostCentersStore } from '../store'

export function getViaboSpeiCostCentersTableActions(table) {
  const { row } = table
  const { original: rowData } = row
  const { setSpeiCostCenter, setOpenNewSpeiCostCenter } = useSpeiCostCentersStore()

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
      <IconButton
        size="small"
        color="primary"
        onClick={e => {
          e.stopPropagation()
          setSpeiCostCenter(rowData)
          setOpenNewSpeiCostCenter(true)
        }}
      >
        <Edit size="small" fontSize="16px" />
      </IconButton>
    </Box>
  )
}
