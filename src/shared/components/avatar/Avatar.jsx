import { forwardRef } from 'react'

import PropTypes from 'prop-types'

import { Avatar as MUIAvatar } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export const Avatar = forwardRef(({ color = 'default', children, sx, ...other }, ref) => {
  const theme = useTheme()

  if (color === 'default') {
    return (
      <MUIAvatar ref={ref} sx={sx} {...other}>
        {children}
      </MUIAvatar>
    )
  }

  return (
    <MUIAvatar
      ref={ref}
      sx={{
        fontWeight: theme.typography.fontWeightMedium,
        color: theme.palette[color].contrastText,
        backgroundColor: theme.palette[color].main,
        ...sx
      }}
      {...other}
    >
      {children}
    </MUIAvatar>
  )
})

Avatar.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
  color: PropTypes.oneOf(['default', 'primary', 'secondary', 'info', 'success', 'warning', 'error'])
}
