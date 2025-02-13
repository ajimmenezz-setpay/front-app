import { useEffect } from 'react'

import { Box, Stack } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

import { LoginForm } from '../components'

import { Page } from '@/shared/components/containers'
import { WalletIllustration } from '@/shared/components/illustrations'
import { FullLogo } from '@/shared/components/images'

const Login = () => {
  const client = useQueryClient()

  useEffect(() => {
    client.removeQueries()
  }, [])

  return (
    <Page title="Inicio de Sesión">
      <Stack alignItems={'center'} justifyContent={'center'} minHeight={'100dvH'}>
        <Stack px={{ sm: 10, xl: 20 }} width={1} height={1} direction={'row'}>
          <Stack
            flexGrow={1}
            width={1}
            height={1}
            minHeight={'70vh'}
            maxHeight={'90vH'}
            position={'relative'}
            sx={{ overflowX: 'hidden', overflowY: 'auto' }}
            justifyContent={'space-between'}
          >
            <Stack direction={'row'} spacing={1} alignItems={'center'} px={{ xs: 5, sm: 0 }}>
              <FullLogo sx={{ width: 150, height: 'auto' }} />
            </Stack>
            <Box flexGrow={1} />
            <Stack flex={1} px={{ xs: 0, sm: 5, xl: 15 }}>
              <LoginForm />
            </Stack>
          </Stack>
          <Stack
            width={1}
            justifyContent={'center'}
            height={1}
            flexGrow={1}
            sx={{ display: { xs: 'none', sm: 'none', lg: 'flex' } }}
          >
            <Box height={1} maxHeight={'90vH'}>
              <WalletIllustration />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Page>
  )
}

export default Login
