import React from 'react'

import { CheckCircle } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'

import { TicketCauseLabel } from '@/app/support/new-ticket-support/components/TicketCauseLabel'
import { Scrollbar } from '@/shared/components/scroll'

const CardCloudMovementTicketSuccess = ({ onFinish, ticket }) => (
  <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
    <Stack flexDirection="column" alignItems={'center'} justifyContent={'center'} spacing={2} p={3}>
      <Stack flexDirection="column" alignItems={'center'} spacing={2}>
        <CheckCircle sx={{ width: 50, height: 50 }} color={'success'} />
        <Stack alignItems={'center'} spacing={1}>
          <Typography variant="h6">{`Operación Exitosa`}</Typography>
          <Typography variant="caption" color={'text.disabled'}>
            {ticket?.createdAt?.format}
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="caption" textAlign={'center'}>
        {ticket?.description}
      </Typography>

      <TicketCauseLabel variant="ghost" color={ticket?.status?.color || 'default'}>
        {ticket?.status?.name?.toUpperCase()}
      </TicketCauseLabel>

      <Typography variant="caption" textAlign={'center'} sx={{ textWrap: 'balance' }}>
        Revise su lista de tickets en el área de soporte del sistema para poderle seguimiento a su reporte.
      </Typography>

      <Stack sx={{ px: 9, pt: 3 }}>
        <Button type="button" size="large" variant="contained" sx={{ fontWeight: 'bold' }} onClick={onFinish}>
          Finalizar
        </Button>
      </Stack>
    </Stack>
  </Scrollbar>
)

export default CardCloudMovementTicketSuccess
