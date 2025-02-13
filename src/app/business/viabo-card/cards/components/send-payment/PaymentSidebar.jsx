import { useEffect, useMemo, useState } from 'react'

import { CheckCircle } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { PaymentForm } from '@/app/business/viabo-card/cards/components/send-payment/PaymentForm'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { RightPanel } from '@/app/shared/components'
import QRExample from '@/shared/assets/img/qr-code.png'
import { Image } from '@/shared/components/images'
import { Scrollbar } from '@/shared/components/scroll'
import { fCurrency } from '@/shared/utils'

export default function PaymentSidebar({ open, setOpen }) {
  const card = useCommerceDetailsCard(state => state.card)

  const [currentBalance, setCurrentBalance] = useState(card?.balance)
  const [showQR, setShowQR] = useState(true)

  const insufficient = useMemo(() => Boolean(currentBalance < 0), [currentBalance])
  const handleClose = () => {
    setOpen(false)
    setShowQR(false)
  }

  useEffect(() => {
    setCurrentBalance(card?.balance)
    setShowQR(false)
  }, [card?.balance])

  return (
    <RightPanel open={open} handleClose={handleClose} title={'Enviar Pago'}>
      {showQR ? (
        <Scrollbar>
          <Stack flexDirection="column" alignItems={'center'} justifyContent={'space-between'} spacing={2} p={5}>
            <Stack flexDirection="column" alignItems={'center'} spacing={2}>
              <Typography variant="subtitle1">Transferencia Exitosa</Typography>
              <CheckCircle sx={{ width: 40, height: 40 }} color={'success'} />
            </Stack>
            <Stack flexDirection="column" alignItems={'center'} justifyContent={'space-between'} spacing={0}>
              <Typography variant="subtitle2">Importe</Typography>
              <Stack direction={'row'} spacing={2} alignItems={'center'}>
                <Typography variant="h3">{fCurrency(100)}</Typography>
                <Typography variant="caption">MXN</Typography>
              </Stack>
            </Stack>
            <Image src={QRExample} sx={{ width: 250 }} />
            <Typography variant="caption" color={'text.disabled'}>
              {format(new Date(), 'dd MMM yyyy hh:mm a', { locale: es })}
            </Typography>
          </Stack>
        </Scrollbar>
      ) : (
        <>
          <Stack
            flexDirection="column"
            alignItems={'center'}
            justifyContent={'space-between'}
            spacing={0}
            px={3}
            pt={3}
            pb={0}
          >
            <Typography variant="subtitle1">Saldo</Typography>
            <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Typography variant="h3" color={insufficient ? 'error' : 'success.main'}>
                {fCurrency(currentBalance)}
              </Typography>
              <Typography variant="caption" color={insufficient ? 'error' : 'success.main'}>
                MXN
              </Typography>
            </Stack>
            {insufficient && (
              <Typography variant="caption" color={'warning.main'} textAlign={'center'}>
                No cuenta con suficiente saldo para realizar la operación
              </Typography>
            )}
          </Stack>
          <PaymentForm
            balance={card?.balance}
            insufficient={insufficient}
            setCurrentBalance={setCurrentBalance}
            setShowQR={setShowQR}
          />
        </>
      )}
    </RightPanel>
  )
}
