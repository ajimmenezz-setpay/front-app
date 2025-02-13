import { FlagCircle } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'

import { useCardCloudSharedStore } from '../../../shared/store'

export const CardCloudMovementsTableActions = ({ table }) => {
  const { row } = table
  const { original: rowData } = row

  const { setSelectedMovement, setOpenSupportTicket } = useCardCloudSharedStore()

  const handleReport = () => {
    setSelectedMovement(rowData)
    setOpenSupportTicket(true)
  }

  return (
    <>
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
        <Tooltip title="Levantar Ticket">
          <IconButton size="small" onClick={handleReport}>
            <FlagCircle color="error" size="small" fontSize="16px" />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  )
}
