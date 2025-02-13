import PropTypes from 'prop-types'

import { CheckCircle } from '@mui/icons-material'
import LinkIcon from '@mui/icons-material/Link'
import { Button, Link, Stack, Typography } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Link as RouterLink } from 'react-router-dom'

import { PaymentCashIllustration } from '@/shared/components/illustrations'
import { fCurrency } from '@/shared/utils'

export const SuccessPaymentByCash = ({ payment, onFinish }) => {
  const urlDownload = payment?.download ? payment?.download : `/orden-fondeo/${payment?.reference}`
  const payURL = payment?.pay

  return (
    <Stack flexDirection="column" alignItems={'center'} justifyContent={'center'} spacing={2} p={3}>
      <Stack flexDirection="column" alignItems={'center'} spacing={2}>
        <CheckCircle sx={{ width: 50, height: 50 }} color={'success'} />
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <Typography variant="h3"> {fCurrency(payment?.amount)}</Typography>
          <Typography variant="caption">MXN</Typography>
        </Stack>

        <Typography variant="h6">{`No. de referencia: ${payment?.reference}`}</Typography>
      </Stack>

      <Typography variant="caption" textAlign={'center'}>
        En el siguiente link encontraras las instrucciones para realizar tu pago en efectivo.
      </Typography>

      <Stack flexDirection="column" alignItems={'center'} spacing={1}>
        {payURL && (
          <Button
            component={Link}
            href={payURL}
            type="button"
            size="large"
            target="_blank"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          >
            Pagar
          </Button>
        )}

        <Stack justifyContent={'center'} alignItems={'center'} direction="row" spacing={1}>
          <LinkIcon />
          <Link component={RouterLink} underline="always" to={urlDownload} target="_blank" color="info.main">
            Descargar Instrucciones
          </Link>
        </Stack>
      </Stack>
      <Typography variant="caption" color={'text.disabled'}>
        {format(new Date(), 'dd MMM yyyy hh:mm a', { locale: es })}
      </Typography>
      <PaymentCashIllustration sx={{ width: 200, height: 200 }} />

      <Stack sx={{ px: 9, pt: 3 }}>
        <Button type="button" size="large" variant="contained" sx={{ fontWeight: 'bold' }} onClick={onFinish}>
          Finalizar
        </Button>
      </Stack>
    </Stack>
  )
}

SuccessPaymentByCash.propTypes = {
  onFinish: PropTypes.func,
  payment: PropTypes.shape({
    amount: PropTypes.any,
    reference: PropTypes.any
  })
}
