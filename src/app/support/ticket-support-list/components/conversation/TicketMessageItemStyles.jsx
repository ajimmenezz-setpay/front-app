import { Typography, styled } from '@mui/material'

const ContentStyle = styled('div')(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 500
  },
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.info.main : theme.palette.info.lighter,
  position: 'relative',
  '&:before': {
    bottom: '100%',
    left: '0%',
    border: '10px solid transparent',
    content: '" "',
    height: 0,
    width: 0,
    position: 'absolute',
    pointerEvents: 'none',
    borderBottomColor: theme.palette.mode === 'dark' ? theme.palette.info.main : theme.palette.info.lighter,
    borderWidth: '7px',
    marginLeft: '15px'
  }
}))

const FileThumbStyle = styled('div')(({ theme }) => ({
  width: 100,
  height: 100,
  flexShrink: 0,
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[500_16],
  '&:hover': { opacity: 0.8 }
}))

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary
}))

export { ContentStyle, FileThumbStyle, InfoStyle }
