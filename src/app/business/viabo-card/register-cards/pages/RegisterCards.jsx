import { Suspense, useMemo } from 'react'

import { Box, CircularProgress, Link, Stack, Typography } from '@mui/material'
import { HiOutlineMail } from 'react-icons/hi'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link as RouterLink } from 'react-router-dom'

import { CARD_ASSIGN_STEPS } from '@/app/business/viabo-card/register-cards/services'
import { useCardUserAssign } from '@/app/business/viabo-card/register-cards/store'
import { PATH_AUTH } from '@/routes'
import Placeholder from '@/shared/assets/img/placeholder.svg'
import RegisterImage from '@/shared/assets/img/register-cards-step-0.webp'
import RegisterImage2 from '@/shared/assets/img/register-cards-step-1.webp'
import { MotionViewport } from '@/shared/components/animate'
import { Page } from '@/shared/components/containers'
import { Logo } from '@/shared/components/images'

export default function RegisterCards() {
  const actualStep = useCardUserAssign(state => state.step)

  const selectedStep = useMemo(() => CARD_ASSIGN_STEPS.find(step => step.name === actualStep), [actualStep])

  if (!selectedStep) {
    return null
  }

  const Component = selectedStep.content

  return (
    <Page title="Registro Tarjetas">
      <Stack alignItems={'center'} justifyContent={'center'} minHeight={'100dvH'}>
        <Stack px={{ xs: 0, sm: 10, xl: 20 }} width={1} height={1} direction={'row'}>
          <Stack
            width={1}
            height={1}
            minHeight={'90vh'}
            maxHeight={'90vH'}
            position={'relative'}
            sx={{ overflowY: 'auto', overflowX: 'hidden' }}
            justifyContent={'space-between'}
          >
            <Stack direction={'row'} spacing={1} alignItems={'center'} px={{ xs: 5, sm: 0 }}>
              <Logo sx={{ width: 50 }} />
              <Typography fontWeight={'600'} variant="subtitle1">
                Agilidad en pagos
              </Typography>
            </Stack>
            <Box flexGrow={1} />
            <Stack flexGrow={1} px={{ xs: 5, xl: 10 }}>
              <Suspense fallback={<Loading />}>
                <MotionViewport>
                  <Component />
                </MotionViewport>
              </Suspense>
            </Stack>
            <Box flexGrow={1}>
              <Stack spacing={1}>
                <Stack justifyContent={'center'} alignItems={'center'} direction={'row'} spacing={1}>
                  <HiOutlineMail fontSize={20} />
                  <Typography variant="caption">ayuda@set.lat</Typography>
                </Stack>
                {selectedStep?.step !== 5 && (
                  <Typography variant="body2" fontWeight={600} align="center" sx={{ color: 'text.secondary' }}>
                    ¡Ya tengo una cuenta! &nbsp;
                    <Link color="primary" component={RouterLink} to={PATH_AUTH.login}>
                      Acceder.
                    </Link>
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
          <Stack
            width={1}
            justifyContent={'center'}
            height={1}
            flexGrow={1}
            ml={1}
            sx={{ display: { xs: 'none', sm: 'none', lg: 'flex' } }}
          >
            <Box
              component={LazyLoadImage}
              wrapperClassName="wrapper"
              effect={'blur'}
              maxHeight={'90vH'}
              placeholderSrc={Placeholder}
              sx={{ width: 1, height: 1, objectFit: 'cover' }}
              src={selectedStep?.step === 1 ? RegisterImage : RegisterImage2}
              borderRadius={4}
            />
          </Stack>
        </Stack>
      </Stack>
    </Page>
  )
}

function Loading() {
  return (
    <Box
      sx={{
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(1px)',
        zIndex: theme => theme.zIndex.modal - 1
      }}
    >
      <CircularProgress />
    </Box>
  )
}
