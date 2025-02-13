import PropTypes from 'prop-types'

import { Stack, Typography } from '@mui/material'

export const PaymentFundingOrderInfo = ({ fundingOrder }) => (
  <Stack spacing={2}>
    <Typography variant={'subtitle1'} fontWeight={'bold'}>
      Datos del Pago
    </Typography>
    <Stack spacing={2}>
      <Stack flexDirection={'row'} gap={1}>
        <Stack flex={1} spacing={0.5}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Referencia
          </Typography>
          <Typography variant="body2">{fundingOrder?.payCash}</Typography>
        </Stack>
        <Stack flex={1} spacing={0.5}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Folio
          </Typography>
          <Typography variant="body2">{fundingOrder?.paymentInfo?.folio || '-'}</Typography>
        </Stack>
      </Stack>

      <Stack flexDirection={'row'} gap={1}>
        <Stack flex={1} spacing={0.5}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Fecha
          </Typography>
          <Typography variant="body2">{fundingOrder?.paymentInfo?.date || '-'}</Typography>
        </Stack>
        <Stack flex={1} spacing={0.5}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Código Autorización
          </Typography>
          <Typography variant="body2">{fundingOrder?.paymentInfo?.authorizationCode || '-'}</Typography>
        </Stack>
      </Stack>
    </Stack>
  </Stack>
)

PaymentFundingOrderInfo.propTypes = {
  fundingOrder: PropTypes.shape({
    payCash: PropTypes.any,
    paymentInfo: PropTypes.shape({
      authorizationCode: PropTypes.string,
      date: PropTypes.string,
      folio: PropTypes.string
    })
  })
}
