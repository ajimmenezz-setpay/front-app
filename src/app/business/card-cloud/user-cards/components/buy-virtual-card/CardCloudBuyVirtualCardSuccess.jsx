import { CheckCircle } from '@mui/icons-material'
import { Button, Divider, Stack, Typography } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const CardCloudBuyVirtualCardSuccess = ({ transaction, onClose }) => {
  const meses = transaction?.request?.months?.value || 0
  const precioMensual = transaction?.request?.monthlyPrice?.number || 0
  const totalPago = meses * precioMensual
  const totalFormateado = `$${totalPago.toFixed(2)}`

  return (
    <Stack>
      <Stack gap={2}>
        <Stack alignItems={'center'} spacing={1}>
          <CheckCircle sx={{ width: 50, height: 50 }} color={'success'} />
          <Stack alignItems={'center'}>
            <Typography variant="h6">{`Operación Exitosa`}</Typography>
            <Typography variant="caption" color={'text.disabled'}>
              {format(new Date(), 'dd MMM yyyy hh:mm a', { locale: es })}
            </Typography>
          </Stack>
          <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui', pb: 2 }} variant="h2">
            {totalFormateado}
          </Typography>
          <Stack
            alignItems={'flex-start'}
            flexDirection={'row'}
            py={2}
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ borderRadius: 1, border: theme => `solid 1px ${theme.palette.divider}`, width: 1 }}
          >
            <Stack px={2} flex={1} justifyContent="center" alignItems={'center'}>
              <Typography variant="subtitle1">Tarjeta de Pago</Typography>
              <Typography
                variant="subtitle2"
                textAlign={'center'}
                sx={{ textTransform: 'capitalize', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
              >
                {transaction?.request?.card?.number?.hidden || 'N/A'}
              </Typography>
              <Typography
                variant="caption"
                textAlign={'center'}
                sx={{ textTransform: 'capitalize', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
              >
                {transaction?.request?.card?.clientId || ''}
              </Typography>
            </Stack>
            <Stack px={2} flex={1} justifyContent="center" alignItems={'center'}>
              <Typography variant="subtitle1">Nueva Tarjeta</Typography>
              <Typography
                variant="subtitle2"
                textAlign={'center'}
                sx={{ textTransform: 'capitalize', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
              >
                {transaction?.newCard?.number?.masked || '**** **** ****'}
              </Typography>
              <Typography
                variant="caption"
                textAlign={'center'}
                sx={{ textTransform: 'capitalize', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
              >
                {transaction?.newCard?.clientId || ''}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          gap={1}
          sx={{ width: 1 }}
          divider={<Divider orientation="horizontal" flexItem sx={{ borderStyle: 'dashed' }} />}
        >
          {/* Resumen del pago */}
          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Meses contratados
            </Typography>
            <Typography variant="overline">{meses} mes (es)</Typography>
          </Stack>

          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Precio por mes
            </Typography>
            <Typography variant="overline">{transaction?.request?.monthlyPrice?.format || '$0.00'}</Typography>
          </Stack>

          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Total pagado
            </Typography>
            <Typography variant="overline">{totalFormateado}</Typography>
          </Stack>

          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Balance nueva tarjeta
            </Typography>
            <Typography variant="overline">{transaction?.newCard?.balance?.format || '$0.00'}</Typography>
          </Stack>

          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Estado nueva tarjeta
            </Typography>
            <Typography variant="overline" color={transaction?.newCard?.status?.color || 'inherit'}>
              {transaction?.newCard?.status?.name || 'Desconocido'}
            </Typography>
          </Stack>

          <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              ID nueva tarjeta
            </Typography>
            <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }} variant="overline">
              {transaction?.newCard?.id || 'No disponible'}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Button sx={{ my: 3 }} fullWidth variant={'outlined'} color="inherit" onClick={onClose}>
        Cerrar
      </Button>
    </Stack>
  )
}

export default CardCloudBuyVirtualCardSuccess
