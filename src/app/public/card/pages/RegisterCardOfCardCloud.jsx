import { lazy } from 'react'

import { Link, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { PATH_AUTH } from '@/routes'
import { Page } from '@/shared/components/containers'
import { WalletIllustration } from '@/shared/components/illustrations'
import { FullLogo } from '@/shared/components/images'
import { Lodable } from '@/shared/components/lodables'
import PublicLayout from '@/shared/layout/PublicLayout'

const RegisterCardStepsOfCardCloud = Lodable(lazy(() => import('../components/RegisterCardStepsOfCardCloud')))

const RegisterCardOfCardCloud = () => (
  <PublicLayout>
    <Page
      title="Activar Tarjeta"
      meta={
        <>
          <meta name="description" content={`Servicio de pagos de SET`} />
          <meta
            name="keywords"
            content={`pay cloud, liga de pago, pago en linea,servició de pago,paypal,paycash,card cloud,payments,pagos SET`}
          />
          <meta property="og:title" content={`Activar y Registrar Tarjeta | SET `} />
          <meta
            property="og:description"
            content={`Esta es la página de SET que permite registrar y activar una tarjeta de crédito`}
          />
        </>
      }
    >
      <Stack
        minHeight={'100dvH'}
        flexDirection={'row'}
        sx={{ backgroundColor: theme => theme.palette.background.paper }}
      >
        <Stack
          flex={0.5}
          sx={{
            backgroundRepeat: 'no-repeat',
            backgroundColor: t =>
              t.palette.mode === 'light' ? t.palette.background.paper : t.palette.background.paper,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          <Stack flexGrow={1} justifyContent={'center'} alignItems={'center'}>
            <WalletIllustration sx={{ height: 1, width: 1, display: 'flex' }} />
          </Stack>
        </Stack>
        <Stack gap={3} flex={{ xs: 1, sm: 0.5 }} sx={{ pb: 6 }}>
          <Paper
            elevation={0}
            sx={{ backgroundColor: 'inherit', p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Stack direction={'row'} mb={4} spacing={2}>
              <FullLogo sx={{ width: 150, height: 'auto' }} />
            </Stack>

            <RegisterCardStepsOfCardCloud />
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

export default RegisterCardOfCardCloud
