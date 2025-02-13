import { useEffect, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { MuiOtpInput } from 'mui-one-time-password-input'

import { TwoAuthIllustration } from '@/shared/components/illustrations'
import { TwoAuthDisabled } from '@/shared/components/notifications'
import { useUser } from '@/shared/hooks'
import { matchIsNumeric } from '@/shared/utils'

const GoogleAuth2FAModal = ({ handleSubmit, handleClose, title, open, isLoading, isErrorCode }) => {
  const { twoAuth } = useUser()

  const [otp, setOtp] = useState('')

  const scrollType = 'paper'

  const handleChange = newValue => {
    setOtp(newValue)
  }

  const validateChar = value => matchIsNumeric(value)

  const handleComplete = value => {
    handleSubmit(value)
  }

  const handleCloseDialog = (event, reason) => {
    if (reason && reason === 'backdropClick') return
    if (reason && reason === 'escapeKeyDown') return
    setOtp('')
    handleClose()
  }

  useEffect(() => {
    if (!open && otp !== '') {
      setOtp('')
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      scroll={scrollType}
      aria-labelledby="scroll-dialog-title-2fa"
      aria-describedby="scroll-dialog-description-2fa"
    >
      <DialogTitle sx={{ mb: scrollType === 'paper' ? 3 : 0 }} id="scroll-dialog-title-2fa">
        {title || 'Google Authenticator'}
      </DialogTitle>
      <DialogContent id="scroll-dialog-description-2fa" dividers={scrollType === 'paper'}>
        <Stack justifyContent={'center'} alignItems={'center'} gap={3}>
          {!twoAuth && (
            <TwoAuthDisabled
              titleMessage={'Google Authenticator'}
              errorMessage={
                'Para realizar esta operación debe activar y configurar el Doble Factor de Autentificación (2FA) desde su perfil.'
              }
            />
          )}
          {twoAuth && (
            <>
              <TwoAuthIllustration sx={{ width: '40%' }} />
              <Typography
                textAlign={'center'}
                variant="body2"
                fontWeight={600}
                sx={{ color: 'text.secondary', textWrap: 'wrap' }}
              >
                Para poder realizar la operación, ingresa a la aplicación de{' '}
                <Box component={'span'} color={'primary.main'}>
                  Google Authenticator
                </Box>{' '}
                y escribe el código a continuación.
              </Typography>
              <MuiOtpInput
                length={6}
                value={otp}
                onComplete={handleComplete}
                onChange={handleChange}
                validateChar={validateChar}
                sx={{ gap: { xs: 1.5, sm: 2, md: 3 } }}
                TextFieldsProps={{ placeholder: '0', disabled: !!isLoading, error: !!isErrorCode, type: 'number' }}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {!isLoading && (
          <Button
            variant="outlined"
            color={'inherit'}
            onClick={() => {
              setOtp('')
              handleClose()
            }}
          >
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default GoogleAuth2FAModal
