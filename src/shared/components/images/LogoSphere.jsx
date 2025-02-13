import { Box, alpha, styled } from '@mui/material'

import { Logo } from './Logo'

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3)
}))

export const LogoSphere = ({ color = 'secondary', ...others }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}
    {...others}
  >
    <IconWrapperStyle
      sx={{
        color: theme => theme.palette[color].main,
        backgroundColor: 'transparent',
        backgroundImage: theme =>
          `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
            theme.palette[color].main,
            0.7
          )} 100%)`,
        boxShadow: '0px 0px 150px 22px rgba(185,255,0,1)'
      }}
    >
      <Logo sx={{ width: 25, height: 25 }} />
    </IconWrapperStyle>
  </Box>
)
