import { lazy } from 'react'

import { Box, Link, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { PATH_AUTH } from '@/routes'
import { Page } from '@/shared/components/containers'
import { WalletIllustration } from '@/shared/components/illustrations'
import { FullLogo } from '@/shared/components/images'
import { Lodable } from '@/shared/components/lodables'
import PublicLayout from '@/shared/layout/PublicLayout'

const RecoverPasswordSteps = Lodable(lazy(() => import('../components/RecoverPasswordSteps')))

const RecoverPassword = () => (
  <PublicLayout>
    <Page
      title="Recuperar Cuenta"
      meta={
        <>
          <meta name="description" content={`Servicio de pagos de SET`} />
          <meta
            name="keywords"
            content={`pay cloud, liga de pago, pago en linea,servició de pago,paypal,paycash,card cloud,payments,pagos SET`}
          />
          <meta property="og:title" content={`Recuperar Contraseña | SET`} />
          <meta
            property="og:description"
            content={`Esta es la página de set transacciones que permite recuperar tu acceso a la plataforma`}
          />
        </>
      }
    >
      <Stack
        minHeight={'100dvH'}
        flexDirection={'row'}
        sx={{ backgroundColor: theme => theme.palette.background.default }}
      >
        <Stack
          flex={0.5}
          sx={{
            backgroundColor: t => t.palette.background.default,

            display: { xs: 'none', sm: 'flex' }
          }}
        >
          <Box height={1} maxHeight={'90vH'}>
            <WalletIllustration />
          </Box>
        </Stack>
        <Stack gap={3} flex={{ xs: 1, sm: 0.5 }} sx={{ pb: 6 }}>
          <Paper
            elevation={0}
            sx={{ backgroundColor: 'inherit', p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Stack direction={'row'} mb={4} spacing={2}>
              <FullLogo sx={{ width: 150, height: 'auto' }} />
            </Stack>
            <RecoverPasswordSteps />

            <Stack mt={4} alignItems={'center'} justifyContent={'center'}>
              <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary' }}>
                ¡Ya tengo una cuenta!
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                <Link
                  sx={{ color: theme => (theme.palette.mode === 'dark' ? 'secondary.main' : 'primary.main') }}
                  component={RouterLink}
                  to={PATH_AUTH.login}
                >
                  Iniciar Sesión
                </Link>
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Page>
  </PublicLayout>
)

export default RecoverPassword
