import PropTypes from 'prop-types'

import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

import { IconButtonAnimate } from '../animate'

const BUTTON_SIZE = 40

const ArrowStyle = styled(IconButtonAnimate, {
  shouldForwardProp: prop => prop !== 'filled'
})(({ filled, theme }) => ({
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  cursor: 'pointer',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    color: theme.palette.text.primary
  },
  ...(filled && {
    opacity: 0.48,
    borderRadius: Number(theme.shape.borderRadius) * 1.5,
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[900],
    '&:hover': {
      opacity: 1,
      color: theme.palette.common.white,
      backgroundColor: theme.palette.grey[900]
    }
  })
}))

CarouselArrows.propTypes = {
  children: PropTypes.node,
  customIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  filled: PropTypes.bool,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func
}

export default function CarouselArrows({
  filled = false,
  customIcon, // Set icon right
  onNext,
  onPrevious,
  children,
  ...other
}) {
  const theme = useTheme()
  const isRTL = theme.direction === 'rtl'

  const style = {
    position: 'absolute',
    mt: -2.5,
    top: '50%',
    zIndex: 9
  }

  if (children) {
    return (
      <Box {...other}>
        <Box className="arrow left" sx={{ ...style, left: 0 }}>
          <ArrowStyle filled={filled} onClick={onPrevious}>
            <KeyboardArrowLeft />
          </ArrowStyle>
        </Box>

        {children}

        <Box className="arrow right" sx={{ ...style, right: 0 }}>
          <ArrowStyle filled={filled} onClick={onNext}>
            <KeyboardArrowRight />
          </ArrowStyle>
        </Box>
      </Box>
    )
  }

  return (
    <Stack direction="row" spacing={1} {...other}>
      <ArrowStyle className="arrow left" filled={filled} onClick={onPrevious}>
        <KeyboardArrowLeft />
      </ArrowStyle>
      <ArrowStyle className="arrow right" filled={filled} onClick={onNext}>
        <KeyboardArrowRight />
      </ArrowStyle>
    </Stack>
  )
}
