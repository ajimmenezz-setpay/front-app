import { PersonRemove } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Dialog, DialogActions, DialogTitle, Paper, Stack, Typography } from '@mui/material'

import { useDeleteSpeiThirdAccount } from '../hooks'
import { useSpeiThirdAccounts } from '../store'

const AlertConfirmationDeleteAccount = () => {
  const { setSpeiThirdAccount, setOpenDeleteSpeiThirdAccount } = useSpeiThirdAccounts()
  const openDeleteAccount = useSpeiThirdAccounts(state => state.openDeleteAccount)
  const account = useSpeiThirdAccounts(state => state.account)

  const { mutate, isLoading } = useDeleteSpeiThirdAccount()

  const handleClose = (event, reason) => {
    if (reason && reason === 'backdropClick') return
    if (reason && reason === 'escapeKeyDown') return
    setSpeiThirdAccount(null)
    setOpenDeleteSpeiThirdAccount(false)
  }

  const handleConfirm = () => {
    const data = {
      externalAccountId: account?.id
    }
    mutate(data, {
      onSuccess: () => {
        handleClose()
      }
    })
  }

  return (
    <Dialog open={openDeleteAccount} fullWidth maxWidth="xs" onClose={handleClose}>
      <DialogTitle>Baja de Cuenta</DialogTitle>
      <DialogTitle sx={{ textWrap: 'pretty', textAlign: 'center', typography: 'subtitle1' }}>
        ¿Está seguro de que quiere dar de baja la cuenta de tercero?
      </DialogTitle>

      <Stack spacing={3} sx={{ p: 3, pb: 0 }}>
        <Box
          component={Paper}
          elevation={2}
          display={'flex'}
          direction="row"
          alignItems="center"
          justifyContent={'justify-between'}
          spacing={2}
          flex={1}
          p={2}
          sx={{
            backgroundColor: theme => theme.palette.error.lighter,
            color: theme => theme.palette.error.dark
          }}
        >
          <Stack flex={1}>
            <Typography fontWeight={'bold'} variant="subtitle2">
              {account?.name}
            </Typography>
            <Typography variant="body2">{account?.bank?.name}</Typography>
            <Typography variant="body2">{account?.email}</Typography>
            <Typography variant="body2">{account?.phone}</Typography>
          </Stack>
          <Stack>
            <PersonRemove color="error" sx={{ width: 30, height: 30 }} />
          </Stack>
        </Box>
      </Stack>
      <DialogActions>
        <LoadingButton loading={isLoading} variant="contained" onClick={handleConfirm}>
          Confirmar
        </LoadingButton>
        {!isLoading && <Button onClick={handleClose}>Cancelar</Button>}
      </DialogActions>
    </Dialog>
  )
}

export default AlertConfirmationDeleteAccount
