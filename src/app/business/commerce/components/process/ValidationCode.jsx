import { useEffect, useState } from 'react'

import PropTypes from 'prop-types'

import { Box, CircularProgress, Divider, Link, Stack, Typography } from '@mui/material'
import { MuiOtpInput } from 'mui-one-time-password-input'

import { useFindCommerceToken } from '@/app/business/commerce/hooks'
import { PROCESS_LIST, PROCESS_LIST_STEPS } from '@/app/business/commerce/services'
import { propTypesStore } from '@/app/business/commerce/store'
import { useSendValidationCode, useValidateCode } from '@/app/business/shared/hooks'
import mail from '@/shared/assets/img/mail.svg'
import { matchIsNumeric } from '@/shared/utils'

ValidationCode.propTypes = {
  store: PropTypes.shape(propTypesStore)
}

function ValidationCode({ store }) {
  const { lastProcess, setActualProcess, setLastProcess, setToken, token, resume } = store
  const { info } = lastProcess
  const { mutate: sendValidationCode, isLoading: isSendingCode } = useSendValidationCode()
  const { mutate: validateCode, isLoading: isValidatingCode, isError: isErrorValidatingCode, reset } = useValidateCode()
  const { data: tokenData, isError } = useFindCommerceToken(info?.email, {
    enabled: Boolean(info?.email)
  })

  useEffect(() => {
    if (tokenData) {
      setToken(tokenData?.token)
    }
  }, [tokenData])

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
          if (resume?.step) {
            setActualProcess(
              PROCESS_LIST_STEPS.find(process => process.step === resume?.step)?.name || PROCESS_LIST.SERVICES_SELECTION
            )
          } else {
            setActualProcess(PROCESS_LIST.SERVICES_SELECTION)
          }
          setLastProcess()
        },
        onError: () => {
          setOtp('')
        }
      }
    )
  }

  const handleResendCode = () => {
    sendValidationCode({ token: tokenData?.token })
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          my: 4
        }}
      >
        <img className="animate__animated animate__pulse" src={mail} width="25%" alt="Sent Mail" />
      </Box>
      <Typography variant="h4" color="textPrimary" align="center">
        Verificación de Cuenta
      </Typography>

      <Typography
        paragraph
        sx={{ mb: 4, mt: 2 }}
        align="center"
        variant="body2"
        color={'text.secondary'}
        whiteSpace="pre-line"
      >
        Enviamos un correo electrónico a {info?.email} con el código de verificacion de tu cuenta, ingrese el código en
        el cuadro a continuación para verificar su cuenta.
      </Typography>
      <MuiOtpInput
        length={6}
        value={otp}
        onComplete={handleComplete}
        onChange={handleChange}
        validateChar={validateChar}
        sx={{ gap: { xs: 1.5, sm: 2, md: 3 } }}
        TextFieldsProps={{ placeholder: '-', error: isErrorValidatingCode, disabled: isValidatingCode, type: 'number' }}
      />
      {Boolean(isErrorValidatingCode) && (
        <Box mt={1}>
          <Typography variant={'caption'} color={'error'}>
            Código incorrecto
          </Typography>
        </Box>
      )}
      <Box mb={5}>
        <Divider sx={{ my: 4 }}>
          <Stack direction={'row'} spacing={1} justifyContent={'center'}>
            {isSendingCode ? (
              <CircularProgress wid sx={{ mx: 3 }} />
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
    </>
  )
}

export default ValidationCode
