import { useEffect, useState } from 'react'

import { Box, Card, Stack } from '@mui/material'
import { m } from 'framer-motion'

import CommercePaymentFooter from './CommercePaymentFooter'
import CommercePaymentForm from './CommercePaymentForm'
import { CommercePaymentInfo } from './CommercePaymentInfo'
import { SuccessPaymentByCash } from './SuccessPaymentByCash'
import { SuccessPaymentByTerminal } from './SuccessPaymentByTerminal'

import { MotionContainer, varFade } from '@/shared/components/animate'

export const CommercePayment = () => {
  const [successPayment, setSuccessPayment] = useState(null)

  const handleSuccessPayment = payment => {
    setSuccessPayment(payment)
  }

  useEffect(() => {
    setSuccessPayment(null)
  }, [])

  return (
    <Stack flex={1} p={4} spacing={3} maxWidth={600} width={1}>
      <CommercePaymentInfo />
      <Card sx={{ display: 'flex', flex: 1 }}>
        <Box component={MotionContainer}>
          <Stack spacing={3}>
            {successPayment?.method === 'cash' && (
              <m.div variants={varFade().in}>
                <SuccessPaymentByCash payment={successPayment} onFinish={() => setSuccessPayment(null)} />
              </m.div>
            )}

            {successPayment?.method === 'terminal' && (
              <m.div variants={varFade().in}>
                <SuccessPaymentByTerminal payment={successPayment} onFinish={() => setSuccessPayment(null)} />
              </m.div>
            )}

            {!successPayment && (
              <m.div variants={varFade().in}>
                <CommercePaymentForm onSuccess={handleSuccessPayment} />
              </m.div>
            )}

            <CommercePaymentFooter />
          </Stack>
        </Box>
      </Card>
    </Stack>
  )
}
