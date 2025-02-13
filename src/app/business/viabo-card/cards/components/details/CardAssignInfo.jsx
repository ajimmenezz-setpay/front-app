import { Card, Stack, Typography } from '@mui/material'

import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'

export function CardAssignInfo() {
  const card = useCommerceDetailsCard(state => state.card)
  const { assignUser } = card

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Asignado a:
      </Typography>
      <Stack spacing={3}>
        <Stack justifyContent={'space-between'} gap={1}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} textTransform={'capitalize'}>
            Nombre
          </Typography>
          <Typography variant="body2">{assignUser?.name}</Typography>
        </Stack>
        {assignUser?.phone && (
          <Stack justifyContent={'space-between'} gap={1}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Telefono
            </Typography>
            <Typography variant="body2">{assignUser?.phone || '-'}</Typography>
          </Stack>
        )}

        <Stack justifyContent={'space-between'} gap={1}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Correo
          </Typography>
          <Typography variant="body2">{assignUser?.email}</Typography>
        </Stack>
      </Stack>
    </Card>
  )
}
