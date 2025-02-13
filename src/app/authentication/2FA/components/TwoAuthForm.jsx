import { useState } from 'react'

import PropTypes from 'prop-types'

import { CheckCircle, HdrStrongTwoTone } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MuiOtpInput } from 'mui-one-time-password-input'

import { Image } from '@/shared/components/images'
import { Scrollbar } from '@/shared/components/scroll'
import { matchIsNumeric, setSession } from '@/shared/utils'

const TwoAuthForm = ({ onFinish, mutateTwoAuth, googleCode }) => {
  const { mutate, isLoading, isSuccess } = mutateTwoAuth

  const [otp, setOtp] = useState('')

  const handleChange = newValue => {
    setOtp(newValue)
  }

  const validateChar = value => matchIsNumeric(value)

  const handleComplete = value => {
    setOtp('')
    mutate(
      { code: value, secret: googleCode?.key },
      {
        onSuccess: data => {
          if (data?.token) {
            setSession(data?.token)
          }
        },
        onError: () => {
          setOtp('')
        }
      }
    )
  }

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <Stack gap={2} p={3} pb={6}>
        {isSuccess && <SuccessTwoAuth onFinish={onFinish} />}
        {!isSuccess && (
          <>
            <Stack>
              <List dense={false}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <HdrStrongTwoTone />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary', textWrap: 'wrap' }}>
                        Descarga la aplicación Google Authenticator en tu teléfono &nbsp;
                        <Link
                          color="primary"
                          rel="noreferrer"
                          target="_blank"
                          href={
                            'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pcampaignid=web_share'
                          }
                          sx={{ cursor: 'pointer' }}
                        >
                          Android
                        </Link>
                        &nbsp; ó &nbsp;
                        <Link
                          color="primary"
                          rel="noreferrer"
                          target="_blank"
                          href={'https://apps.apple.com/es/app/google-authenticator/id388497605'}
                          sx={{ cursor: 'pointer' }}
                        >
                          IOS
                        </Link>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <HdrStrongTwoTone />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary', textWrap: 'wrap' }}>
                        En la Aplicación configura tu cuenta
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <HdrStrongTwoTone />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary', textWrap: 'wrap' }}>
                        Elige la opción de escanear un código QR
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <HdrStrongTwoTone />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary', textWrap: 'wrap' }}>
                        Escanea el siguiente QR e ingresa el código
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Stack>
            {isLoading ? (
              <Stack spacing={1} justifyContent={'center'} alignItems={'center'}>
                <CircularProgress />
                <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary', textWrap: 'wrap' }}>
                  Configurando dispositivo...
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.disabled', textWrap: 'wrap' }}>
                  No cierres la ventana hasta que se complete la configuración
                </Typography>
              </Stack>
            ) : (
              <>
                <Stack justifyContent={'center'} alignItems={'center'}>
                  <Image src={googleCode?.qr} sx={{ width: 150, m: 0, p: 0 }} />
                </Stack>
                <MuiOtpInput
                  length={6}
                  value={otp}
                  onComplete={handleComplete}
                  onChange={handleChange}
                  validateChar={validateChar}
                  sx={{ gap: { xs: 1.5, sm: 2, md: 3 } }}
                  TextFieldsProps={{ placeholder: '0', type: 'number' }}
                />
              </>
            )}
          </>
        )}
      </Stack>
    </Scrollbar>
  )
}

TwoAuthForm.propTypes = {
  googleCode: PropTypes.shape({
    key: PropTypes.any,
    qr: PropTypes.any
  }),
  mutateTwoAuth: PropTypes.shape({
    isLoading: PropTypes.any,
    isSuccess: PropTypes.any,
    mutate: PropTypes.func
  }),
  onFinish: PropTypes.any
}

export default TwoAuthForm

function SuccessTwoAuth({ onFinish }) {
  return (
    <Stack flexDirection="column" alignItems={'center'} spacing={2} mt={3}>
      <CheckCircle sx={{ width: 50, height: 50 }} color={'success'} />
      <Stack alignItems={'center'} spacing={1}>
        <Typography variant="h6">{`Configuración Exitosa`}</Typography>
        <Typography variant="caption" color={'text.disabled'}>
          {format(new Date(), 'dd MMM yyyy hh:mm a', { locale: es })}
        </Typography>
      </Stack>
      <Stack sx={{ px: 9, pt: 3 }}>
        <Button type="button" size="large" variant="contained" sx={{ fontWeight: 'bold' }} onClick={onFinish}>
          Finalizar
        </Button>
      </Stack>
    </Stack>
  )
}

SuccessTwoAuth.propTypes = {
  onFinish: PropTypes.any
}
