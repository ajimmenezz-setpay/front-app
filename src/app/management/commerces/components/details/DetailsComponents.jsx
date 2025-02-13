import { CheckTwoTone, ClearTwoTone, Warning } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'

export const DetailsComponents = styled(props => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

export const IconWrapperStyleDetails = styled('div')(({ theme }) => ({
  width: 30,
  height: 30,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.08)
}))

export const SuccessIconDetails = ({ widthWrapper = 30, heightWrapper = 30, opacity = 0.08, ...others }) => (
  <IconWrapperStyleDetails
    sx={{
      color: `success.main`,
      bgcolor: theme => alpha(theme.palette.success.main, opacity),
      width: widthWrapper,
      height: heightWrapper
    }}
  >
    <CheckTwoTone sx={{ width: 15, height: 15 }} {...others} />
  </IconWrapperStyleDetails>
)

export const ErrorIconDetails = () => (
  <IconWrapperStyleDetails
    sx={{
      color: `error.main`,
      bgcolor: theme => alpha(theme.palette.error.main, 0.08)
    }}
  >
    <ClearTwoTone sx={{ width: 15, height: 15 }} />
  </IconWrapperStyleDetails>
)

export const WarningIconDetails = () => (
  <IconWrapperStyleDetails
    sx={{
      color: `warning.main`,
      width: 25,
      height: 25,
      bgcolor: theme => alpha(theme.palette.warning.main, 0.2)
    }}
  >
    <Warning sx={{ width: 13, height: 13 }} />
  </IconWrapperStyleDetails>
)
