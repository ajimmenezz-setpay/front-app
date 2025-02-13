import { memo, useMemo } from 'react'

import { EmailTwoTone, LockTwoTone, PhoneTwoTone } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Box, Card, InputAdornment, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { updateUserDataAdapter } from '../../shared/adapters'
import { useUpdateUserData } from '../../shared/hooks'

import { Avatar } from '@/shared/components/avatar'
import { FormLabelTypography, FormProvider, Label, RFTextField } from '@/shared/components/form'
import { useAuth } from '@/shared/hooks'
import { createAvatar } from '@/theme/utils'

const GeneralUserInfo = () => {
  const { user, refreshAccessToken } = useAuth()

  const { mutate, isLoading } = useUpdateUserData()

  const RegisterSchema = Yup.object().shape({
    userName: Yup.string().trim().required('Es necesario el nombre(s)'),
    userLastName: Yup.string().trim().required('Es necesario los apellido(s)'),
    userEmail: Yup.string().trim().email('Ingrese un correo valido').required('Es necesario el correo electrónico'),
    userPhone: Yup.string().trim(),
    googleCode: Yup.string()
      .trim()
      .matches(/^0*\d{6}$/, 'El código de Google debe contener exactamente 6 dígitos')
      .required('Es necesario el código de 6 dígitos')
  })

  const formik = useFormik({
    initialValues: {
      userName: user?.firstName || '',
      userLastName: user?.lastName || '',
      userEmail: user?.email || '',
      userPhone: user?.phone || '',
      photoURL: '',
      googleCode: ''
    },
    validationSchema: RegisterSchema,
    enableReinitialize: true,
    onSubmit: (values, { setFieldValue, setSubmitting }) => {
      const userData = updateUserDataAdapter(values)
      mutate(userData, {
        onSuccess: data => {
          if (data?.token) {
            refreshAccessToken(data?.token)
          }
          setSubmitting(false)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })
  const { isSubmitting, values } = formik

  const loading = isSubmitting || isLoading

  const disabled = !user?.twoAuth || loading

  const updateName = useMemo(() => {
    if (values?.userName?.trim() === '' && values?.userLastName?.trim() === '') {
      return `${user?.firstName} ${user?.lastName}`
    }
    return `${values?.userName?.trim()} ${values?.userLastName?.trim()}`
  }, [values?.userLastName, values?.userName])

  const avatar = useMemo(() => createAvatar(updateName), [updateName])

  return (
    <Stack>
      <FormProvider formik={formik}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          minHeight={{ xs: 400, xl: 500 }}
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: '30% auto'
          }}
        >
          <Card
            variant="outlined"
            sx={{
              p: 5,
              textAlign: 'center'
            }}
          >
            <Stack height={1} justifyContent="center" alignItems="center">
              <Avatar
                src={user?.avatar !== '' ? user?.avatar : ''}
                alt={updateName}
                color={avatar?.color || 'info'}
                sx={{ fontSize: 50, width: { xs: 100, lg: 150, xl: 200 }, height: { xs: 100, lg: 150, xl: 200 } }}
              >
                {avatar?.name}
              </Avatar>
              <Stack sx={{ mt: 3 }} gap={1}>
                <Typography variant="h6">{updateName}</Typography>
                <Box>
                  <Label variant="ghost" color="info">
                    {user?.profile}
                  </Label>
                </Box>
              </Stack>
            </Stack>
          </Card>
          <Card variant="outlined" sx={{ p: 5 }}>
            {!user?.twoAuth && (
              <Alert severity={'warning'} sx={{ width: 1, mb: 3 }} variant="outlined">
                <AlertTitle>Google Authenticator</AlertTitle>
                Para actualizar sus datos debe activar y configurar el Doble Factor de Autentificación (2FA) desde su
                perfil.
              </Alert>
            )}

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)'
              }}
            >
              <Stack spacing={1}>
                <FormLabelTypography required fontWeight={'bold'}>
                  Nombre (s)
                </FormLabelTypography>

                <RFTextField disabled={disabled} name={'userName'} required placeholder={'Nombre del usuario...'} />
              </Stack>
              <Stack spacing={1}>
                <FormLabelTypography required fontWeight={'bold'}>
                  Apellido (s)
                </FormLabelTypography>

                <RFTextField
                  name={'userLastName'}
                  required
                  placeholder={'Apellidos del usuario...'}
                  disabled={disabled}
                />
              </Stack>
              <Stack spacing={1} flex={1}>
                <FormLabelTypography required fontWeight={'bold'} noWrap>
                  Correo Electrónico
                </FormLabelTypography>
                <RFTextField
                  name={'userEmail'}
                  required
                  placeholder={'usuario@gmail.com...'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailTwoTone />
                      </InputAdornment>
                    )
                  }}
                  disabled={disabled}
                />
              </Stack>
              <Stack spacing={1} flex={1}>
                <FormLabelTypography fontWeight={'bold'} noWrap>
                  Teléfono
                </FormLabelTypography>

                <RFTextField
                  name={'userPhone'}
                  type={'tel'}
                  placeholder={'55 5555 5555'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneTwoTone />
                      </InputAdornment>
                    )
                  }}
                  disabled={disabled}
                />
              </Stack>
              {user?.twoAuth && (
                <Stack spacing={1}>
                  <FormLabelTypography required fontWeight={'bold'} noWrap>
                    Token de Google
                  </FormLabelTypography>
                  <RFTextField
                    name={'googleCode'}
                    type={'text'}
                    placeholder={'000000'}
                    inputProps={{ maxLength: '6' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockTwoTone />
                        </InputAdornment>
                      )
                    }}
                    disabled={loading}
                  />
                </Stack>
              )}
            </Box>

            {user?.twoAuth && (
              <Stack justifyContent={'center'} alignItems="center" sx={{ mt: 4 }}>
                <LoadingButton
                  sx={{
                    maxWidth: 200
                  }}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={loading}
                >
                  Guardar
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Box>
      </FormProvider>
    </Stack>
  )
}

export default memo(GeneralUserInfo)
