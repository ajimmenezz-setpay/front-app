import { Box, Grid } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { RegisterProcess } from '@/app/business/commerce/components'
import BGLogin from '@/shared/assets/img/bg-login.webp'
import TransactionsImage from '@/shared/assets/img/login-transactions.webp'
import Placeholder from '@/shared/assets/img/placeholder.svg'
import { Page } from '@/shared/components/containers'

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.1),
  backgroundImage: `url(${BGLogin})`,
  backgroundRepeat: 'no-repeat'
}))

function CommerceRegister() {
  return (
    <Page title="Registro Comercio">
      <Grid container spacing={0} component="main" justifyContent={'center'} height={'100vH'}>
        <Grid item elevation={0} xs={false} sm={false} md={6} xl={7}>
          <Box
            sx={{
              position: 'relative',
              display: { xs: 'none', md: 'flex' },
              height: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <OverlayStyle />
            <Box
              component={LazyLoadImage}
              delayTime={1000}
              effect={'blur'}
              wrapperClassName="wrapper"
              placeholderSrc={Placeholder}
              sx={{ width: 0.8, objectFit: 'cover', m: '0 auto' }}
              alt={'Imagen transacciones SET'}
              src={TransactionsImage}
              decoding={'async'}
              loading={'lazy'}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6} xl={5} alignItems="center" justify="center" sx={{ overflow: 'auto' }}>
          <RegisterProcess />
        </Grid>
      </Grid>
    </Page>
  )
}

export default CommerceRegister
