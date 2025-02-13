import { IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'

export const SidebarButtonMobileStyle = styled(props => <IconButton disableRipple {...props} />)(({ theme }) => ({
  left: 0,
  zIndex: theme.zIndex.drawer - 1,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(21),
  borderRadius: `0 12px 12px 0`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.darker
  }
}))

export const SidebarButtonStyle = styled(props => <IconButton disableRipple {...props} />)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'boder-box',
  display: 'inline-flex',
  outline: '0px',
  margin: '0px',
  cursor: 'pointer',
  userSelect: 'none',
  textDecoration: 'none',
  textAlign: 'center',
  borderRadius: '50%',
  overflow: 'visible',
  color: 'rgb(145, 158, 171)',
  fontSize: '1.125rem',
  padding: '4px',
  zIndex: theme.zIndex.appBar - 1,
  border: '1px dashed rgba(145, 158, 171, 0.24)',
  backdropFilter: 'blur(6px)',
  lineHeight: 0
}))

export const SIDEBAR_WIDTH = 320
export const SIDEBAR_COLLAPSE_WIDTH = 96
