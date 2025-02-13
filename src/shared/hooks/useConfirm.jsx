import { useState } from 'react'

import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

export const useConfirm = (title, message) => {
  const [promise, setPromise] = useState(null)

  const confirm = () =>
    new Promise(resolve => {
      setPromise({ resolve })
    })

  const handleClose = () => setPromise(null)

  const handleCancel = () => {
    promise?.resolve(false)
    handleClose()
  }

  const handleConfirm = () => {
    promise?.resolve(true)
    handleClose()
  }

  const ConfirmDialog = ({ loading = false, ...rest }) => (
    <Dialog
      open={promise !== null}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...rest}
    >
      <DialogTitle sx={{ paddingBottom: 2 }} id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>{message}</DialogContent>
      <DialogActions>
        {!loading && (
          <Button variant="outlined" color="inherit" onClick={handleCancel}>
            Cancelar
          </Button>
        )}

        <LoadingButton onClick={handleConfirm} color={'primary'} loading={loading} variant="contained">
          Continuar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )

  return [ConfirmDialog, confirm]
}
