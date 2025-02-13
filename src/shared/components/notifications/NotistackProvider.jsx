import PropTypes from 'prop-types'

import { Cancel, CheckCircle, Close, Warning } from '@mui/icons-material'
import { Box, IconButton, styled } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { InfoIcon } from '@theme/overrides/components/CustomIcons'
import { SnackbarProvider, closeSnackbar } from 'notistack'

NotistackProvider.propTypes = {
  children: PropTypes.node
}

const StyledSnackbarProvider = styled(SnackbarProvider)(({ theme }) => ({
  '&.notistack-SnackbarContainer': {
    width: 'calc(100dvh - 200px)'
  },
  '&#notistack-snackbar': {
    maxWidth: '88%'
  },
  '&.notistack-MuiContent': {
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.neutral : theme.palette.background.paper
  },
  '&.SnackbarItem-variantSuccess, &.SnackbarItem-variantError, &.SnackbarItem-variantWarning, &.SnackbarItem-variantInfo':
    {
      color: theme.palette.text.primary,
      backgroundColor:
        theme.palette.mode === 'light' ? theme.palette.background.neutral : theme.palette.background.paper
    },
  '& .SnackbarItem-message': {
    padding: '0 !important',
    fontWeight: theme.typography.fontWeightMedium
  },
  '& .SnackbarItem-action': {
    marginRight: 0,
    color: theme.palette.action.active,
    '& svg': { width: 20, height: 20 }
  }
}))

export function NotistackProvider({ children }) {
  return (
    <StyledSnackbarProvider
      dense
      maxSnack={5}
      preventDuplicate
      autoHideDuration={5000}
      variant="success" // Set default variant
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      iconVariant={{
        info: <SnackbarIcon icon={<InfoIcon width={24} height={24} />} color="info" />,
        success: <SnackbarIcon icon={<CheckCircle width={24} height={24} />} color="success" />,
        warning: <SnackbarIcon icon={<Warning width={24} height={24} />} color="warning" />,
        error: <SnackbarIcon icon={<Cancel width={24} height={24} />} color="error" />
      }}
      action={key => (
        <IconButton size="small" onClick={() => closeSnackbar(key)} sx={{ m: 0, p: 0, position: 'fixed', right: 16 }}>
          <Close />
        </IconButton>
      )}
    >
      {children}
    </StyledSnackbarProvider>
  )
}

SnackbarIcon.propTypes = {
  icon: PropTypes.element,
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error'])
}

function SnackbarIcon({ icon, color }) {
  return (
    <Box
      component="span"
      sx={{
        mr: 1.5,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        color: `${color}.main`,
        p: 1,
        backgroundColor: theme => alpha(theme.palette[color].main, 0.16)
      }}
    >
      {icon}
    </Box>
  )
}
