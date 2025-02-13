import { CardHeader, Stack, Typography } from '@mui/material'

import { StockCardMenu } from '@/app/management/stock-cards/components/stock-card/StockCardMenu'
import { CardCVV, CardNumber, CardStyled } from '@/app/shared/components/card'

export function StockCard({ card }) {
  return (
    <CardStyled>
      <CardHeader
        action={<StockCardMenu card={card} />}
        title={<Typography sx={{ typography: 'subtitle2', opacity: 0.72 }}>Viabo Card</Typography>}
        subheader={card?.register}
        sx={{ p: 0 }}
      />

      <div>
        <CardNumber card={card} />
      </div>

      <Stack direction="row" spacing={5}>
        <Stack>
          <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>Vencimiento</Typography>
          <Typography sx={{ typography: 'subtitle1' }}>{card?.expiration}</Typography>
        </Stack>
        <CardCVV card={card} />
      </Stack>
    </CardStyled>
  )
}
