import { useState } from 'react'

import { CheckCircle } from '@mui/icons-material'
import { Box, Button, CircularProgress, Divider, Link, Stack, Typography } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import { MuiOtpInput } from 'mui-one-time-password-input'
import { Link as RouterLink } from 'react-router-dom'

import { useResetPasswordUser } from '@/app/authentication/recovery-account/hooks'
import { useSendValidationCode, useValidateCode } from '@/app/business/shared/hooks'
import { PATH_AUTH } from '@/routes'
import { axios } from '@/shared/interceptors'
import { matchIsNumeric } from '@/shared/utils'

const RecoverPasswordValidationCode = ({ token, email }) => {
  const { mutate: sendValidationCode, isLoading: isSendingCode } = useSendValidationCode()
  const { mutate: validateCode, isLoading: isValidatingCode, isError: isErrorValidatingCode, reset } = useValidateCode()
  const { mutate: recoverPassword, isLoading: isRecovering, isSuccess } = useResetPasswordUser()

  const [otp, setOtp] = useState('')

  const handleChange = newValue => {
    setOtp(newValue)
    reset()
  }

  const validateChar = value => matchIsNumeric(value)

  const handleComplete = value => {
    validateCode(
      { verificationCode: value, token },
      {
        onSuccess: () => {
          const decoded = jwtDecode(token)
          recoverPassword(
            { userId: decoded?.id },
            {
              onSuccess: () => {
                delete axios.defaults.headers.common.Authorization
              },
              onError: () => {
                setOtp('')
                reset()
              }
            }
          )
        },
        onError: () => {
          setOtp('')
        }
      }
    )
  }

  const handleResendCode = () => {
    sendValidationCode({ token })
  }

  const loading = isValidatingCode || isRecovering

  if (isSuccess && !loading) {
    return (
      <motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Stack height={1} gap={3}>
          <Stack flexDirection="column" alignItems={'center'} spacing={2}>
            <CheckCircle sx={{ width: 50, height: 50 }} color={'success'} />
            <Stack alignItems={'center'} spacing={1}>
              <Typography variant="h6">{`Operación Exitosa`}</Typography>
              <Typography variant="caption" color={'text.disabled'}>
                {format(new Date(), 'dd MMM yyyy hh:mm a', { locale: es })}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="column" width={1} spacing={1}>
            <Typography variant="h4" color="textPrimary" align="center">
              Tu cuenta se recupero con éxito
            </Typography>

            <Typography paragraph align="center" variant="body1" color={'text.secondary'} whiteSpace="pre-line">
              Enviamos un correo electrónico a {email || '-'} con los datos de acceso de tu cuenta.
            </Typography>
          </Stack>
          <Stack mt={3}>
            <Button size={'large'} component={RouterLink} to={PATH_AUTH.login} variant={'contained'} color={'primary'}>
              Acceder
            </Button>
          </Stack>
        </Stack>
      </motion.div>
    )
  }

  return (
    <motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Typography variant="h4" color="textPrimary" align="center">
        Recuperación de Cuenta
      </Typography>

      <Typography
        paragraph
        sx={{ mb: 4, mt: 2 }}
        align="center"
        variant="body2"
        color={'text.secondary'}
        whiteSpace="pre-line"
      >
        Enviamos un correo electrónico a {email} con el código de verificación de tu cuenta, ingrese el código en el
        cuadro a continuación para recuperar su cuenta.
      </Typography>
      <MuiOtpInput
        length={6}
        value={otp}
        onComplete={handleComplete}
        onChange={handleChange}
        validateChar={validateChar}
        sx={{ gap: { xs: 1.5, sm: 2, md: 2 } }}
        TextFieldsProps={{
          placeholder: '-',
          error: isErrorValidatingCode,
          disabled: loading,
          type: 'number',
          size: 'small'
        }}
      />
      {Boolean(isErrorValidatingCode) && (
        <Box mt={1}>
          <Typography variant={'caption'} color={'error'}>
            Código incorrecto
          </Typography>
        </Box>
      )}
      {loading && (
        <Stack mt={3} alignItems={'center'} justifyContent={'center'}>
          <CircularProgress />
        </Stack>
      )}
      <Box mb={5}>
        <Divider sx={{ my: 4 }}>
          <Stack direction={'row'} spacing={1} justifyContent={'center'}>
            {isSendingCode ? (
              <CircularProgress sx={{ mx: 3 }} />
            ) : (
              <>
                <Typography variant={'body2'}>¿No tengo un código?</Typography>
                <Link underline={'hover'} sx={{ cursor: 'pointer' }} onClick={handleResendCode}>
                  <Typography variant={'body2'} color={'primary'}>
                    Reenviar código
                  </Typography>
                </Link>
              </>
            )}
          </Stack>
        </Divider>
      </Box>
    </motion.div>
  )
}

export default RecoverPasswordValidationCode
