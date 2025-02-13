import { useEffect, useRef } from 'react'

import PropTypes from 'prop-types'

import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

Modal.propTypes = {
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  children: PropTypes.node,
  open: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  scrollType: PropTypes.string,
  title: PropTypes.string,
  textButtonSuccess: PropTypes.string,
  disableLoadingIndicator: PropTypes.bool
}

export function Modal(props) {
  const {
    title,
    textButtonSuccess,
    isSubmitting,
    open,
    scrollType = 'paper',
    onClose,
    onSuccess,
    disableLoadingIndicator = false,
    children,
    ...rest
  } = props

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.between('xs', 'sm'))

  const descriptionElementRef = useRef(null)

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') return
    if (reason && reason === 'escapeKeyDown') return
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={scrollType}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      // PaperProps={{ style: { overflowY: 'visible' } }}
      {...rest}
    >
      <DialogTitle sx={{ mb: scrollType === 'paper' ? 3 : 0 }} id="scroll-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent
        id="scroll-dialog-description"
        // style={{ overflowY: 'visible' }}
        dividers={scrollType === 'paper'}
      >
        {children}
      </DialogContent>
      <DialogActions>
        {!isSubmitting && (
          <Button variant="outlined" color={'inherit'} onClick={onClose}>
            Cerrar
          </Button>
        )}
        <LoadingButton onClick={onSuccess} loading={isSubmitting} color={'primary'} variant="contained">
          {textButtonSuccess}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
