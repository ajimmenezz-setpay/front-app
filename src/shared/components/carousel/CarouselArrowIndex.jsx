import PropTypes from 'prop-types'

import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { alpha, styled, useTheme } from '@mui/material/styles'

const RootStyle = styled(Box)(({ theme }) => ({
  zIndex: 9,
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[900], 0.48)
}))

const ArrowStyle = styled(IconButton)(({ theme }) => ({
  padding: 6,
  opacity: 0.48,
  color: theme.palette.common.white,
  '&:hover': { opacity: 1 }
}))

// ----------------------------------------------------------------------

CarouselArrowIndex.propTypes = {
  customIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  index: PropTypes.number,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  total: PropTypes.number
}

export default function CarouselArrowIndex({ index, total, onNext, onPrevious, customIcon, ...other }) {
  const theme = useTheme()
  const isRTL = theme.direction === 'rtl'

  return (
    <RootStyle {...other}>
      <ArrowStyle size="small" onClick={onPrevious}>
        <KeyboardArrowLeft />
      </ArrowStyle>

      <Typography variant="subtitle2">
        {index + 1}/{total}
      </Typography>

      <ArrowStyle size="small" onClick={onNext}>
        <KeyboardArrowRight />
      </ArrowStyle>
    </RootStyle>
  )
}
