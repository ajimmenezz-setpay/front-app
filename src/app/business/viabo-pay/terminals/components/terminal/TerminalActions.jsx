import { Suspense, lazy, useState } from 'react'

import { Apps, Link } from '@mui/icons-material'
import { Button, Divider, Stack } from '@mui/material'

const PaymentLinkModal = lazy(() => import('../payment-link/PaymentLinkModal'))
const VirtualTerminalModal = lazy(() => import('../virtual-terminal/VirtualTerminalModal'))

export const TerminalActions = () => {
  const [openPaymentLink, setOpenPaymentLink] = useState(false)
  const [openVirtualTerminal, setOpenVirtualTerminal] = useState(false)

  return (
    <>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Stack px={2} py={1} flexDirection={'row'} justifyContent={'space-between'}>
        <Button size="small" startIcon={<Link />} onClick={() => setOpenPaymentLink(true)}>
          Liga de Pago
        </Button>
        <Button
          size="small"
          startIcon={<Apps />}
          sx={{ textWrap: 'nowrap' }}
          onClick={() => setOpenVirtualTerminal(true)}
        >
          Term. Virtual
        </Button>
      </Stack>
      <Suspense>
        <PaymentLinkModal open={openPaymentLink} setOpen={setOpenPaymentLink} />
      </Suspense>
      <Suspense>
        <VirtualTerminalModal open={openVirtualTerminal} setOpen={setOpenVirtualTerminal} />
      </Suspense>
    </>
  )
}
