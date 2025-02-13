import PropTypes from 'prop-types'

import { Switch, styled } from '@mui/material'

const SIZES = {
  sm: {
    width: 21,
    height: 14,
    thumb: 10
  },
  md: {
    width: 34,
    height: 18,
    thumb: 14
  },
  lg: {
    width: 42,
    height: 26,
    thumb: 22
  }
}
const RootStyle = styled(Switch)(({ theme, ownerState }) => {
  const isLight = theme.palette.mode === 'light'
  const { color, size } = ownerState

  return {
    width: SIZES[size]?.width || 42,
    height: SIZES[size]?.height || 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: size === 'sm' ? 'translateX(8px)' : 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5
        }
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff'
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600]
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
      }
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: SIZES[size]?.thumb || 22,
      height: SIZES[size]?.thumb || 22
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.error.main,
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500
      })
    }
  }
})

function IOSSwitch({ size = 'lg', ...other }) {
  return <RootStyle ownerState={{ size }} {...other} />
}

export default IOSSwitch

IOSSwitch.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
}
