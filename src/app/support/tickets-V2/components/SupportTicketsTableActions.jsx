import { Visibility } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'

import { useSupportTicketsV2Store } from '../store'

export const SupportTicketsTableActions = ({ table }) => {
  const { row } = table
  const { original: rowData } = row
  const { setOpenTicketDetails, setSelectedTicket } = useSupportTicketsV2Store()

  const handleDetails = () => {
    setSelectedTicket(rowData)
    setOpenTicketDetails(true)
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
        <Tooltip title="Ver Detalles">
          <IconButton size="small" onClick={handleDetails}>
            <Visibility size="small" fontSize="16px" />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  )
}
