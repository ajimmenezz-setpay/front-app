import { memo } from 'react'

import { Box, Divider, Link, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { PUBLIC_PATHS } from '@/routes'
import { AmexLogo, CarnetLogo, MasterCardLogo, VisaLogo } from '@/shared/components/images'

const CommercePaymentFooter = () => (
  <Stack spacing={2} justifyContent={'center'} alignItems={'center'} p={3}>
    <Box component={'marquee'} behavior="scroll" direction="left" py={2}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
        spacing={2}
      >
        <Paper sx={{ p: 1, backgroundColor: theme => theme.palette.background.neutral }}>
          <VisaLogo sx={{ width: 30, height: 30 }} />
        </Paper>

        <Paper sx={{ p: 1, backgroundColor: theme => theme.palette.background.neutral }}>
          <MasterCardLogo sx={{ width: 30, height: 30 }} />
        </Paper>

        <Paper sx={{ p: 1, backgroundColor: theme => theme.palette.background.neutral }}>
          <CarnetLogo sx={{ width: 30, height: 30 }} />
        </Paper>

        <Paper sx={{ p: 1, backgroundColor: theme => theme.palette.background.neutral }}>
          <AmexLogo sx={{ width: 30, height: 30 }} />
        </Paper>

        <Paper sx={{ p: 1, backgroundColor: theme => theme.palette.background.neutral }}>
          <Box sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center' }}>
            <img
              alt="File:7-eleven logo.svg"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/272px-7-eleven_logo.svg.png?20160121231038"
              decoding="async"
              width="100%"
              srcSet="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/408px-7-eleven_logo.svg.png?20160121231038 1.5x, 
                        https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/544px-7-eleven_logo.svg.png?20160121231038 2x"
              data-file-width="272"
              data-file-height="264"
            />
          </Box>
        </Paper>

        <Paper sx={{ p: 1, backgroundColor: theme => theme.palette.background.neutral }}>
          <Box sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center' }}>
            <img
              width="100%"
              alt="File:Oxxo Logo.svg"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/512px-Oxxo_Logo.svg.png?20220119215336"
              decoding="async"
              srcSet="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/768px-Oxxo_Logo.svg.png?20220119215336 1.5x, 
                      https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Oxxo_Logo.svg/1024px-Oxxo_Logo.svg.png?20220119215336 2x"
              data-file-width="512"
              data-file-height="259"
            />
          </Box>
        </Paper>

        <Paper sx={{ p: 1, backgroundColor: theme => theme.palette.background.neutral }}>
          <Box sx={{ width: 30, height: 30, display: 'flex', alignItems: 'center' }}>
            <img
              alt="File:Walmart logo.svg"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/512px-Walmart_logo.svg.png?20220910022324"
              decoding="async"
              width="100%"
              srcSet="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/768px-Walmart_logo.svg.png?20220910022324 1.5x, 
              https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/1024px-Walmart_logo.svg.png?20220910022324 2x"
              data-file-width="512"
              data-file-height="123"
            />
          </Box>
        </Paper>
        <Paper sx={{ p: 1, backgroundColor: theme => theme.palette.background.neutral }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#2C981D',
              px: 1,
              borderRadius: 16
            }}
          >
            <img
              loading="lazy"
              alt="Bodega"
              decoding="async"
              width="100%"
              src="https://i5.walmartimages.com/dfw/63fd9f59-7e00/e687286b-6259-46a9-a691-99028aada2b6/v1/Bodega_Aurrera_logo.svg"
            />
          </Box>
        </Paper>
        <Paper sx={{ p: 1, backgroundColor: theme => theme.palette.background.neutral }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <img
              alt="File:Circle K logo.svg"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Circle_K_logo.svg/276px-Circle_K_logo.svg.png"
              decoding="async"
              width="100%"
              srcSet=" https//upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Circle_K_logo.svg/414px-Circle_K_logo.svg.png 1.5x, 
              https//upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Circle_K_logo.svg/552px-Circle_K_logo.svg.png 2x"
              data-file-width="276"
              data-file-height="276"
            />
          </Box>
        </Paper>
      </Stack>
    </Box>

    <Stack justifyContent={'center'} alignItems={'center'}>
      <Typography variant="subtitle2">© 2023 Viabo. Todos los derechos reservados. </Typography>
      <Link
        component={RouterLink}
        underline="hover"
        color={'text.primary'}
        sx={{ fontSize: 12 }}
        to={PUBLIC_PATHS.privacy}
        target="_blank"
      >
        Acuerdos de privacidad
      </Link>
    </Stack>
  </Stack>
)

export default memo(CommercePaymentFooter)
