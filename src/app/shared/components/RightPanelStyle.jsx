import { alpha, styled } from '@mui/material/styles'
import { NAVBAR } from '@theme/overrides/options'
import { cssStyles } from '@theme/utils'
import { m } from 'framer-motion'

export const RightPanelStyle = styled(m.div)(({ theme, width }) => ({
  ...cssStyles(theme).bgBlur({ color: theme.palette.background.paper, opacity: 0.92 }),
  top: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  position: 'fixed',
  overflow: 'hidden',
  width: width || NAVBAR.BASE_WIDTH + 200,
  [theme.breakpoints.down('md')]: {
    width: '100%'
  },
  flexDirection: 'column',
  margin: 0,
  paddingBottom: theme.spacing(3),
  zIndex: theme.zIndex.drawer + 3,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: `-24px 12px 32px -4px ${alpha(
    theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
    0.16
  )}`
}))
