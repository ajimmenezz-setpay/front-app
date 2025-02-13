import { lazy, useMemo } from 'react'

import { Close } from '@mui/icons-material'
import { Avatar, Box, Divider, Drawer, Stack, Typography, alpha, styled } from '@mui/material'
import { useResponsive } from '@theme/hooks'

import { useEnableTwoAuth, useFindGoogleAuthenticatorQR } from '@/app/authentication/2FA/hooks'
import GoogleAuth from '@/shared/assets/icons/google-auth.svg'
import { IconButtonAnimate } from '@/shared/components/animate'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { useAuth } from '@/shared/hooks'
import { useUiSharedStore } from '@/shared/store'

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
  backgroundColor:
    theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.7) : alpha(theme.palette.secondary.main, 0.5)
}))

const TwoAuthForm = Lodable(lazy(() => import('./TwoAuthForm')))

const TwoAuthDrawer = () => {
  const setOpenTwoAuthConfig = useUiSharedStore(state => state.setOpenTwoAuthConfig)
  const openTwoAuthConfig = useUiSharedStore(state => state.openTwoAuthConfig)

  const mutateTwoAuth = useEnableTwoAuth()
  const { data, isLoading, error, isError, refetch } = useFindGoogleAuthenticatorQR({ enabled: !!openTwoAuthConfig })

  const { setTwoAuth } = useAuth()
  const isSuccess = useMemo(() => mutateTwoAuth.isSuccess, [mutateTwoAuth.isSuccess])

  const handleClose = () => {
    setOpenTwoAuthConfig(false)
    if (isSuccess) {
      setTwoAuth(true)
    }
  }

  const matches = useResponsive('down', 'md')

  const handleDrawerClose = event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    handleClose()
  }

  const handleFinish = () => {
    setOpenTwoAuthConfig(false)
    setTwoAuth(true)
  }

  return (
    <Drawer
      keepMounted={false}
      anchor={matches ? 'bottom' : 'right'}
      sx={{
        '& .MuiPaper-root.MuiDrawer-paper': {
          borderRadius: `${!matches ? '10px 0px 0px 10px' : 'none'}`,
          width: { sm: '100%', lg: '40%', xl: '30%' }
        }
      }}
      open={openTwoAuthConfig}
      onClose={handleDrawerClose}
      ModalProps={{
        keepMounted: false
      }}
    >
      {isLoading && <RequestLoadingComponent sx={{ p: 3 }} />}
      {isError && !isLoading && (
        <Stack gap={2}>
          <Stack>
            <Stack flexDirection={'row'} justifyContent={'flex-end'} alignItems={'flex-end'} sx={{ px: 2, py: 1 }}>
              <IconButtonAnimate aria-label="close" size="medium" onClick={handleClose}>
                <Close width={20} height={20} fontSize="inherit" color="primary" />
              </IconButtonAnimate>
            </Stack>
            <Divider />
          </Stack>
          <ErrorRequestPage
            sx={{ p: 3 }}
            errorMessage={error}
            titleMessage={'Google Authenticator'}
            handleButton={() => refetch()}
          />
        </Stack>
      )}

      {!isError && !isLoading && openTwoAuthConfig && (
        <>
          <Stack position={'relative'} sx={{ minHeight: 100, mb: 3 }}>
            <OverlayStyle />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ zIndex: 11, px: 2.5, py: 2 }}
            >
              <Typography variant="h5" color={'white'}>
                Google Authenticator
              </Typography>

              <div>
                <IconButtonAnimate aria-label="close" size="medium" onClick={handleClose}>
                  <Close width={20} height={20} fontSize="inherit" color="primary" sx={{ color: 'white' }} />
                </IconButtonAnimate>
              </div>
            </Stack>
            <Box
              component="span"
              sx={{
                width: 144,
                height: 62,
                zIndex: 10,
                left: 0,
                right: 0,
                bottom: -26,
                mx: 'auto',
                position: 'absolute',
                display: 'inline-block',

                color: theme => theme.palette.background.paper
              }}
            >
              <svg height="62" viewBox="0 0 144 62" width="144" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </Box>

            <Avatar
              alt={'google-authenticator'}
              sx={{
                width: 60,
                height: 60,
                zIndex: 11,
                left: 0,
                right: 0,
                bottom: -30,
                mx: 'auto',
                position: 'absolute'
              }}
              src={GoogleAuth}
            />
          </Stack>
          <TwoAuthForm onFinish={handleFinish} mutateTwoAuth={mutateTwoAuth} googleCode={data} />
        </>
      )}
    </Drawer>
  )
}

export default TwoAuthDrawer
