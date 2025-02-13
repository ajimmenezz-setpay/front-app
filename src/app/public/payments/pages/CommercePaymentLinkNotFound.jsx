import { memo } from 'react'

import { Button, Container, Stack, Typography, styled } from '@mui/material'
import { m } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'

import { MotionContainer, varBounce } from '@/shared/components/animate'
import { CreditCardIllustration } from '@/shared/components/illustrations'

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}))

const CommercePaymentLink = () => (
  <RootStyle>
    <Container component={MotionContainer}>
      <Stack spacing={1} sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            ¡Liga de Pagos No Encontrada!
          </Typography>
        </m.div>
        <Typography sx={{ color: 'text.secondary' }}>
          Lo sentimos, la página que estás buscando no se encuentra disponible.
        </Typography>

        <m.div variants={varBounce().in}>
          <CreditCardIllustration />
        </m.div>

        <Button to="/" size="large" variant="contained" component={RouterLink}>
          Regresar
        </Button>
      </Stack>
    </Container>
  </RootStyle>
)

export default memo(CommercePaymentLink)
