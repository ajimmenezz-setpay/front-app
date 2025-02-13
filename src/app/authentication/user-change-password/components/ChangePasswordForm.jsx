import PropTypes from 'prop-types'

import { Refresh } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Alert, AlertTitle, Box, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { MuiOtpInput } from 'mui-one-time-password-input'
import * as Yup from 'yup'

import { ChangePasswordAdapter } from '@/app/authentication/user-change-password/adapters'
import { useChangePassword } from '@/app/authentication/user-change-password/hooks'
import { useSendValidationCode } from '@/app/business/shared/hooks'
import { IconButtonAnimate } from '@/shared/components/animate'
import { FormProvider, RFPasswordField } from '@/shared/components/form'
import { useUser } from '@/shared/hooks'
import { matchIsNumeric } from '@/shared/utils'

const ChangePasswordForm = ({ onSuccess }) => {
  const user = useUser()

  const { mutate, isLoading } = useChangePassword()
  const { mutate: sendCode, isLoading: isSendingCode } = useSendValidationCode()

  const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().trim().required('La contraseña actual es requerida'),
    newPassword: Yup.string()
      .trim()
      .required('La contraseña nueva es requerida')
      .matches(
        '^(?=(?:.*\\d))(?=.*[A-Z])(?=.*[a-z])(?=.*[_\\-.\\@])\\S{8,16}$',
        'La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula , un número y un carácter especial [ - _ . @]'
      ),
    verifyNewPassword: Yup.string()
      .trim()
      .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas no coinciden')
      .required('La confirmación de la contraseña es requerida'),
    authCode: Yup.string().required('El código de autorización es requerido')
  })

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      verifyNewPassword: '',
      authCode: ''
    },
    enableReinitialize: true,
    validationSchema: ChangePasswordSchema,
    onSubmit: (values, { setSubmitting, setFieldTouched }) => {
      const data = ChangePasswordAdapter(values)
      mutate(data, {
        onSuccess: () => {
          setSubmitting(false)
          onSuccess()
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { isSubmitting, setFieldValue, values, errors } = formik

  const loading = isSubmitting || isLoading

  const handleChange = newValue => {
    setFieldValue('authCode', newValue)
  }

  const validateChar = value => matchIsNumeric(value)

  return (
    <FormProvider formik={formik}>
      <Stack spacing={2} p={3}>
        <Alert severity="info">
          <AlertTitle>Código de Autorización</AlertTitle>
          Enviamos un correo electrónico a{' '}
          {
            <Box component={'span'} fontWeight={'bold'}>
              {user?.email}{' '}
            </Box>
          }
          con el código de autorización.
        </Alert>
        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Contraseña Actual *
          </Typography>

          <RFPasswordField
            size={'small'}
            name={'currentPassword'}
            disabled={loading}
            required
            placeholder={'********'}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Contraseña Nueva *
          </Typography>

          <RFPasswordField size={'small'} name={'newPassword'} placeholder={'********'} disabled={loading} required />
        </Stack>

        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Repetir Contraseña Nueva *
          </Typography>

          <RFPasswordField
            size={'small'}
            placeholder={'********'}
            name={'verifyNewPassword'}
            disabled={loading}
            required
          />
        </Stack>

        <Stack spacing={1}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Código de Autorización *
            </Typography>
            <IconButtonAnimate
              size="small"
              onClick={sendCode}
              color="info"
              disabled={isSendingCode}
              aria-haspopup="true"
              title="Reenviar"
            >
              <Refresh width={20} height={20} />
            </IconButtonAnimate>
          </Stack>

          <Stack>
            <MuiOtpInput
              length={6}
              value={values.authCode}
              onChange={handleChange}
              validateChar={validateChar}
              sx={{ gap: { xs: 1.5, sm: 2, md: 3 } }}
              TextFieldsProps={{
                placeholder: '-',
                error: !!errors.authCode,
                disabled: loading,
                size: 'small',
                type: 'number'
              }}
            />
            {Boolean(errors.authCode) && (
              <Box mt={1}>
                <Typography variant={'caption'} color={'error'}>
                  {errors.authCode}
                </Typography>
              </Box>
            )}
          </Stack>
        </Stack>

        <Stack pt={2}>
          <LoadingButton
            loading={loading}
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ fontWeight: 'bold' }}
          >
            Guardar
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

ChangePasswordForm.propTypes = {
  onSuccess: PropTypes.func
}

export default ChangePasswordForm
