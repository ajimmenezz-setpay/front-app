import { Card, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const RowStyle = styled('div')({
  display: 'flex',
  justifyContent: 'space-between'
})

export function CardBalance({ card, title }) {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h6" gutterBottom textTransform={'capitalize'}>
            {title || `Balance`}
          </Typography>
          {card?.monthBalance && (
            <Typography variant="subtitle2" gutterBottom textTransform={'capitalize'}>
              {card?.monthBalance}
            </Typography>
          )}
        </Stack>

        <Stack spacing={2}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="h4">{card?.balanceMovements}</Typography>
            <Typography variant="caption">MXN</Typography>
          </Stack>

          <RowStyle>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ingresos
            </Typography>
            <Typography sx={{ color: 'success.main' }} variant="body2">
              {card?.income}
            </Typography>
          </RowStyle>

          <RowStyle>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Egresos
            </Typography>
            <Typography variant="body2" sx={{ color: 'error.main' }}>
              - {card?.expenses}
            </Typography>
          </RowStyle>
        </Stack>
      </Stack>
    </Card>
  )
}
