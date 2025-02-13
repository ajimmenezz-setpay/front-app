import { useEffect, useState } from 'react'

import { LockPersonRounded } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { AlertTitle, Box, CircularProgress, Divider, InputLabel, Link, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { m } from 'framer-motion'
import { MuiOtpInput } from 'mui-one-time-password-input'
import { Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'

import { useValidateGoogleAuthCode } from '../../2FA/hooks'
import { useSignIn } from '../hooks'

import { PUBLIC_PATHS } from '@/routes'
import { AlertWithFocus } from '@/shared/components/alerts'
import { MotionViewport, varFade } from '@/shared/components/animate'
import { FormProvider, RFPasswordField, RFTextField, TypewriterTypography } from '@/shared/components/form'
import { useAuth } from '@/shared/hooks'
import { matchIsNumeric, setSession } from '@/shared/utils'

export function LoginForm() {
  const { login: loginContext } = useAuth()
  const { mutate: login, error, isError, isLoading, isSuccess, setCustomError, isTwoAuth, token } = useSignIn()
  const [showTwoAuth, setShowTwoAuth] = useState(false)
  const [otp, setOtp] = useState('')
  const {
    mutate: validateCode,
    isLoading: isValidatingCode,
    error: errorCode,
    isError: isErrorCode
  } = useValidateGoogleAuthCode()

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Ingrese un correo valido').required('El correo es requerido'),
    password: Yup.string().required('La contraseña es requerida')
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setSubmitting }) => {
      setCustomError(null)
      const data = {
        username: values?.email,
        password: values?.password
      }
      login(data)
    }
  })

  const { isSubmitting, setSubmitting } = formik

  const loading = isLoading || isSubmitting

  useEffect(() => {
    if (isSuccess || isError) {
      setSubmitting(false)
    }
    if (isSuccess && !isTwoAuth) {
      loginContext()
      setShowTwoAuth(false)
    }
    if (isSuccess && isTwoAuth) {
      setShowTwoAuth(true)
    }
  }, [isError, isSuccess, isTwoAuth])

  const handleChange = newValue => {
    setOtp(newValue)
  }

  const validateChar = value => matchIsNumeric(value)

  const handleComplete = value => {
    validateCode(
      { googleAuthenticatorCode: value, token },
      {
        onSuccess: () => {
          setSession(token)
          setShowTwoAuth(false)
          loginContext()
        },
        onError: () => {
          setOtp('')
          setSession(null)
        }
      }
    )
  }

  if (showTwoAuth) {
    return (
      <MotionViewport>
        <Stack gap={5} p={4} justifyContent={'center'} height={1}>
          <Stack>
            <m.div variants={varFade().inRight}>
              <Typography
                align="center"
                variant="h3"
                sx={{
                  color: 'primary.main',
                  fontWeight: 'fontWeightMedium'
                }}
              >
                Ingresa tu código
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Typography
                align="center"
                variant="h3"
                sx={{
                  color: 'primary.light',
                  fontWeight: 'fontWeightMedium'
                }}
              >
                de autentificación
              </Typography>
            </m.div>

            <Stack justifyContent={'center'} alignItems={'center'} mt={3}>
              <LockPersonRounded sx={{ width: 40, height: 40, color: isErrorCode ? 'error.main' : 'primary.main' }} />
            </Stack>
          </Stack>

          <Stack justifyContent={'center'} alignItems={'center'} gap={3}>
            <Typography
              textAlign={'center'}
              variant="body2"
              fontWeight={600}
              sx={{ color: 'text.secondary', textWrap: 'wrap' }}
            >
              Ingresa a la aplicación de{' '}
              <Box component={'span'} color={'primary.main'}>
                Google Authenticator
              </Box>{' '}
              y escribe el código a continuación
            </Typography>
            <MuiOtpInput
              length={6}
              value={otp}
              onComplete={handleComplete}
              onChange={handleChange}
              validateChar={validateChar}
              sx={{
                gap: { xs: 1.5, sm: 2, md: 3 },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0
                  }
                }
              }}
              TextFieldsProps={{ placeholder: '0', disabled: isValidatingCode, error: isErrorCode, type: 'number' }}
            />
          </Stack>
          {isValidatingCode && (
            <Stack justifyContent={'center'} alignItems={'center'} gap={3}>
              <CircularProgress />
              <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary', textWrap: 'wrap' }}>
                Iniciando Sesión...
              </Typography>
            </Stack>
          )}
        </Stack>
      </MotionViewport>
    )
  }

  return (
    <MotionViewport>
      <Stack spacing={3} p={4} justifyContent={'center'} height={1}>
        <Stack>
          <m.div variants={varFade().inRight}>
            <Typography
              align="center"
              variant="h3"
              sx={{
                color: 'primary.main',
                fontWeight: 'fontWeightMedium'
              }}
            >
              Aquí Comienza
            </Typography>
          </m.div>

          <m.div variants={varFade().inRight}>
            <Typography
              align="center"
              variant="h3"
              sx={{
                color: 'primary.light',
                fontWeight: 'fontWeightMedium'
              }}
            >
              tu agilidad en pagos
            </Typography>
          </m.div>
        </Stack>

        <TypewriterTypography
          color={'common'}
          text={'¡Es tiempo de transformar tu negocio!'}
          variant="h6"
          align="center"
        />

        {error && (
          <AlertWithFocus listenElement={error} sx={{ mt: 3, textAlign: 'initial' }} severity={error?.code}>
            <AlertTitle sx={{ textAlign: 'initial' }}>Inicio de Sesión</AlertTitle>
            {error?.message}
          </AlertWithFocus>
        )}
        <m.div {...varFade().in}>
          <FormProvider formik={formik}>
            <Stack spacing={2} flex={1}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <RFTextField
                  id="email"
                  disabled={loading}
                  name={'email'}
                  placeholder={'usuario@dominio.com'}
                  type={'email'}
                  fullWidth
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <InputLabel htmlFor="password">Contraseña</InputLabel>
                <RFPasswordField
                  id="password"
                  InputLabelProps={{
                    shrink: true
                  }}
                  disabled={loading}
                  name="password"
                  placeholder={'********'}
                  fullWidth
                />
              </Stack>

              <Stack pt={1}>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  size={'large'}
                  disabled={isSubmitting}
                >
                  Accesar a mi cuenta
                </LoadingButton>
                <Divider sx={{ mt: 3 }}>
                  <Typography variant="body2" color="textPrimary" align="center">
                    <Link variant="body2" className="navlink" component={RouterLink} to={PUBLIC_PATHS.recover_password}>
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </Typography>
                </Divider>
              </Stack>

              <Stack pt={1} alignItems={'center'} justifyContent={'center'}>
                <Typography variant="body2" fontWeight={600}>
                  <Link
                    sx={{ color: theme => (theme.palette.mode === 'dark' ? 'secondary.main' : 'primary.main') }}
                    component={RouterLink}
                    to={PUBLIC_PATHS.card}
                  >
                    Activar Acceso
                  </Link>
                </Typography>
              </Stack>
            </Stack>
          </FormProvider>
        </m.div>
      </Stack>
    </MotionViewport>
  )
}
