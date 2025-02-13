import PropTypes from 'prop-types'

import { Button, Stack, Typography } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { PaymentTerminalIllustration } from '@/shared/components/illustrations'
import { fCurrency } from '@/shared/utils'

export const SuccessPaymentByTerminal = ({ payment, onFinish }) => (
  <Stack flexDirection="column" alignItems={'center'} justifyContent={'center'} spacing={2} p={3}>
    <Stack flexDirection="column" alignItems={'center'} spacing={2}>
      <Typography variant="h6">{`¡Gracias por tu pago!`}</Typography>
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <Typography variant="h3"> {fCurrency(payment?.amount)}</Typography>
        <Typography variant="caption">MXN</Typography>
      </Stack>
    </Stack>

    <Typography variant="caption" color={'text.disabled'}>
      {format(new Date(), 'dd MMM yyyy hh:mm a', { locale: es })}
    </Typography>

    <PaymentTerminalIllustration sx={{ width: 200, height: 200 }} />

    <Stack sx={{ px: 9, pt: 3 }}>
      <Button type="button" size="large" variant="contained" sx={{ fontWeight: 'bold' }} onClick={onFinish}>
        Finalizar
      </Button>
    </Stack>
  </Stack>
)

SuccessPaymentByTerminal.propTypes = {
  onFinish: PropTypes.func,
  payment: PropTypes.shape({
    amount: PropTypes.any
  })
}
