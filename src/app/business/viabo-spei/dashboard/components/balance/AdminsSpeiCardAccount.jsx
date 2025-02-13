import { useState } from 'react'

import PropTypes from 'prop-types'

import { Person } from '@mui/icons-material'
import { Avatar, Box, CardContent, CardHeader, IconButton, Stack, Typography, styled } from '@mui/material'
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi'

import { Logo } from '@/shared/components/images'

const HEIGHT = 250

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  height: HEIGHT,
  borderRadius: Number(theme.shape.borderRadius) * 2
}))

const CardItemStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  height: HEIGHT - 16,
  padding: theme.spacing(3),
  // color: theme.palette.common.white,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  // backgroundColor: 'inherit',
  background:
    theme.palette.mode === 'dark'
      ? `linear-gradient(45deg, ${theme.palette.secondary.darker} 0%, ${theme.palette.secondary.darker} 30%, ${theme.palette.secondary.dark} 100%)`
      : `linear-gradient(-45deg,  ${theme.palette.primary.lighter} 0%,  ${theme.palette.primary.lighter} 30%, ${theme.palette.primary.dark} 100%)`,
  // backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backdropFilter: 'blur(40px)',
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow: theme.customShadows.card
}))

const shadowStyle = {
  mx: 'auto',
  width: 'calc(100% - 16px)',
  borderRadius: 2,
  position: 'absolute',
  height: 200,
  zIndex: 8,
  bottom: 8,
  left: 0,
  right: 0,
  bgcolor: 'grey.500',
  backdropFilter: 'blur(40px)',
  opacity: 0.32
}

export const AdminSpeiCardAccount = ({ stpAccount }) => {
  const [show, setShow] = useState(false)

  return (
    <RootStyle>
      <Box
        sx={{
          position: 'relative',
          zIndex: 9
        }}
      >
        <CardItemStyle>
          <CardHeader
            sx={{ p: 0, pb: 3, color: 'white' }}
            avatar={
              <Avatar sx={{ backgroundColor: theme => theme.palette.background.default, width: 35, height: 35 }}>
                <Person color="primary" sx={{ width: 25, height: 25 }} />
              </Avatar>
            }
            title={<Typography sx={{ typography: 'subtitle1', color: 'white' }}>{stpAccount?.name}</Typography>}
            subheader={<Typography sx={{ typography: 'subtitle2', color: 'white' }}>{stpAccount?.type}</Typography>}
          />
          <CardContent sx={{ p: 0, display: 'flex' }}>
            <Stack gap={3} flex={1}>
              <Stack gap={0}>
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <Typography sx={{ typography: 'h6' }}>
                    {show ? stpAccount?.account?.number : stpAccount?.account?.hidden}
                  </Typography>
                  <Box>
                    <IconButton size={'small'} color="inherit" onClick={() => setShow(!show)} sx={{ opacity: 0.7 }}>
                      {show ? <PiEyeBold /> : <PiEyeClosedBold />}
                    </IconButton>
                  </Box>
                </Stack>
                <Typography color={'white'} sx={{ typography: 'subtitle2' }}>
                  Cuenta Origen | STP
                </Typography>
              </Stack>

              <Stack gap={0} justifyContent={'space-between'} flexDirection={'row'}>
                <Stack flex={1}>
                  <Typography sx={{ typography: 'h6' }}>{stpAccount?.totalBalance?.format}</Typography>
                  <Typography color={'white'} sx={{ typography: 'subtitle2' }}>
                    Balance Total
                  </Typography>
                </Stack>
                <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'center'}>
                  <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'center'}>
                    <Logo sx={{ width: 60, height: 'auto' }} />
                    <Typography variant="h6" color={'primary.main'}>
                      |
                    </Typography>
                    <Typography variant="h6" color={'primary.main'}>
                      spei
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </CardItemStyle>
      </Box>

      <Box sx={{ ...shadowStyle }} />
      <Box
        sx={{
          ...shadowStyle,
          opacity: 0.16,
          bottom: 0,
          zIndex: 7,
          width: 'calc(100% - 40px)'
        }}
      />
    </RootStyle>
  )
}

AdminSpeiCardAccount.propTypes = {
  stpAccount: PropTypes.shape({
    account: PropTypes.shape({
      hidden: PropTypes.any,
      number: PropTypes.any
    }),
    balance: PropTypes.shape({
      format: PropTypes.any
    }),
    name: PropTypes.any,
    totalBalance: PropTypes.shape({
      format: PropTypes.any
    }),
    type: PropTypes.any
  })
}
