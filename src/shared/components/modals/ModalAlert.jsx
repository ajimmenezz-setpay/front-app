import PropTypes from 'prop-types'

import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

const TYPES_ALERT = ['primary', 'secondary', 'success', 'error', 'info', 'warning']

ModalAlert.propTypes = {
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  open: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  title: PropTypes.any,
  description: PropTypes.node,
  textButtonSuccess: PropTypes.string,
  textButtonCancel: PropTypes.string,
  typeAlert: PropTypes.oneOf(TYPES_ALERT),
  actionsProps: PropTypes.any
}

export function ModalAlert(props) {
  const {
    title,
    description,
    typeAlert,
    textButtonSuccess,
    textButtonCancel = 'Cancelar',
    isSubmitting,
    open,
    onClose,
    onSuccess,
    actionsProps,
    ...rest
  } = props

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') return
    if (reason && reason === 'escapeKeyDown') return
    onClose()
  }

  const dialogPaperSx = TYPES_ALERT.includes(typeAlert)
    ? {
        '& .MuiDialog-paper': {
          color: theme => theme.palette[typeAlert].darker,
          bgcolor: theme => theme.palette[typeAlert].lighter
        }
      }
    : {}

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={dialogPaperSx}
      {...rest}
    >
      <DialogTitle sx={{ paddingBottom: 2 }} id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>{description}</DialogContent>
      <DialogActions {...actionsProps}>
        {!isSubmitting && (
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            {textButtonCancel}
          </Button>
        )}

        <LoadingButton
          onClick={onSuccess}
          color={TYPES_ALERT.includes(typeAlert) ? typeAlert : 'primary'}
          loading={isSubmitting}
          variant="contained"
        >
          {textButtonSuccess}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
