import PropTypes from 'prop-types'

import { Backdrop, Box } from '@mui/material'
import { useCollapseDrawer } from '@theme/hooks'

import { CircularLoading } from '@/shared/components/loadings/CircularLoading'

export function RequestLoading({ ...rest }) {
  const { isCollapse } = useCollapseDrawer()

  return (
    <Backdrop
      sx={theme => ({
        height: '100dvH',
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        top: 0,
        left: 0,
        justifyContent: 'center',
        backgroundColor: 'inherit',
        backdropFilter: 'blur(40px)',
        zIndex: theme => theme.zIndex.appBar - 1,
        transition: theme.transitions.create(['left', 'margin-left', 'width'], {
          duration: theme.transitions.duration.shorter
        })
      })}
      {...rest}
    >
      <CircularLoading />
    </Backdrop>
  )
}

export function RequestLoadingComponent({ sx, ...others }) {
  return (
    <Box
      sx={{
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(1px)',
        zIndex: theme => theme.zIndex.modal - 1,
        ...sx
      }}
      {...others}
    >
      <CircularLoading />
    </Box>
  )
}

RequestLoadingComponent.propTypes = {
  sx: PropTypes.any
}
