import { lazy, useState } from 'react'

import { FlagCircle } from '@mui/icons-material'
import { Box, Stack, Typography } from '@mui/material'

import { useCardCloudSharedStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'

const CardCloudMovementTicketForm = Lodable(lazy(() => import('./CardCloudMovementTicketForm')))
const CardCloudMovementTicketSuccess = Lodable(lazy(() => import('./CardCloudMovementTicketSuccess')))

const CardCloudMovementSupportTicketDrawer = () => {
  const { setSelectedMovement, setOpenSupportTicket } = useCardCloudSharedStore()
  const { selectedMovement, openSupportTicket } = useCardCloudSharedStore()
  const [ticket, setTicket] = useState(null)

  const handleClose = () => {
    setOpenSupportTicket(false)
    setSelectedMovement(null)
    setTicket(null)
  }

  const handleSuccess = ticket => {
    if (!ticket) {
      handleClose()
    }
    setTicket(ticket)
  }

  return (
    <RightPanel
      open={openSupportTicket}
      handleClose={handleClose}
      titleElement={
        <Stack gap={1}>
          <Box display={'inline-flex'} gap={1} alignItems={'center'}>
            <FlagCircle sx={{ color: theme => theme.palette.error.main }} />
            <Typography variant="h6">Reporte del Movimiento</Typography>
          </Box>

          <Stack>
            <Typography variant="caption">{selectedMovement?.description}</Typography>
            <Typography variant="caption" color={'text.secondary'}>
              {selectedMovement?.id}
            </Typography>
            <Typography variant="caption" color={'text.secondary'}>
              {selectedMovement?.date?.dateTime}
            </Typography>
            <Typography variant="subtitle1">{selectedMovement?.amount?.format}</Typography>
          </Stack>
        </Stack>
      }
    >
      {!ticket && openSupportTicket && (
        <CardCloudMovementTicketForm movement={selectedMovement} onSuccess={handleSuccess} onCancel={handleClose} />
      )}
      {ticket && openSupportTicket && <CardCloudMovementTicketSuccess ticket={ticket} onFinish={handleClose} />}
    </RightPanel>
  )
}

export default CardCloudMovementSupportTicketDrawer
