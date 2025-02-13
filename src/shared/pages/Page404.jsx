import { useEffect } from 'react'

import { Button, Container, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { m } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'

import { MotionContainer, varBounce } from '../components/animate'

import { Page } from '@/shared/components/containers'
import { PageNotFoundIllustration } from '@/shared/components/illustrations'

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}))

export default function Page404() {
  useEffect(() => {
    localStorage.removeItem('lastPath')
  }, [])

  return (
    <Page title="404 Page Not Found">
      <RootStyle>
        <Container component={MotionContainer}>
          <Stack spacing={1} sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                Página No Encontrada!
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Lo sentimos, la página que estás buscando no se encuentra disponible.
            </Typography>

            <m.div variants={varBounce().in}>
              <PageNotFoundIllustration />
            </m.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              Regresar
            </Button>
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  )
}
