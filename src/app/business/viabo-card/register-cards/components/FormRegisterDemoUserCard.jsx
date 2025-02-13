import { EmailOutlined, VerifiedUser } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Checkbox, FormControlLabel, InputAdornment, InputLabel, Link, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { MuiTelInput } from 'mui-tel-input'
import { Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'

import { useRegisterDemoUser } from '@/app/business/viabo-card/register-cards/hooks'
import { CARD_ASSIGN_PROCESS_LIST } from '@/app/business/viabo-card/register-cards/services'
import { useCardUserAssign } from '@/app/business/viabo-card/register-cards/store'
import { PUBLIC_PATHS } from '@/routes'
import { FormProvider, RFTextField } from '@/shared/components/form'
import { axios } from '@/shared/interceptors'

export default function FormRegisterDemoUserCard() {
  const setStep = useCardUserAssign(state => state.setStepAssignRegister)
  const setUser = useCardUserAssign(state => state.setUser)
  const setToken = useCardUserAssign(state => state.setToken)
  const token = useCardUserAssign(state => state.token)

  const { mutate: registerDemoUser, isLoading: isRegisteringDemoUser } = useRegisterDemoUser()

  const registerValidation = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    email: Yup.string().email('Ingresa un correo valido').required('El correo es requerido'),
    phone: Yup.string().test(
      'longitud',
      'El telefono es muy corto',
      value => !(value && value.replace(/[\s+]/g, '').length < 10)
    )
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      privacy: false
    },
    validationSchema: registerValidation,
    onSubmit: values => {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      registerDemoUser(values, {
        onSuccess: data => {
          if (data?.token) {
            setToken(data?.token)
            setUser(values)
            setStep(CARD_ASSIGN_PROCESS_LIST.USER_VALIDATION)
          }
          setSubmitting(false)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { errors, touched, isSubmitting, setFieldValue, values, setSubmitting, getFieldProps } = formik

  const loading = isSubmitting || isRegisteringDemoUser

  return (
    <Stack>
      <Stack direction="column" width={1} spacing={0}>
        <Typography variant="h4" color="textPrimary" align="center">
          Crear Cuenta
        </Typography>
        <Typography paragraph align="center" variant="subtitle1" color={'text.primary'} whiteSpace="pre-line">
          ¡Es tiempo de transformar tu negocio!
        </Typography>
      </Stack>

      <FormProvider formik={formik}>
        <Stack spacing={2} sx={{ p: 3, px: 5 }}>
          <Stack spacing={1}>
            <InputLabel>Nombre Completo*</InputLabel>
            <RFTextField name={'name'} required={true} placeholder={'Usuario'} disabled={loading} size={'small'} />
          </Stack>

          <Stack spacing={1}>
            <InputLabel>Correo Electrónico*</InputLabel>
            <RFTextField
              name={'email'}
              required={true}
              placeholder={'usuario@dominio.com'}
              disabled={loading}
              size={'small'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                )
              }}
            />
          </Stack>

          <Stack spacing={1}>
            <InputLabel>Teléfono</InputLabel>
            <MuiTelInput
              name="phone"
              fullWidth
              langOfCountryName="es"
              preferredCountries={['MX', 'US']}
              continents={['NA', 'SA']}
              value={values.phone || '+52'}
              disabled={loading}
              onChange={(value, info) => {
                setFieldValue('phone', value)
              }}
              size={'small'}
              error={touched.phone && Boolean(errors.phone)}
              helperText={touched.phone && errors.phone}
            />
          </Stack>
          <Stack justifyContent={'center'} alignItems={'center'}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  {...getFieldProps('privacy')}
                  disabled={loading}
                  checked={values?.apiRequired}
                  value={values?.apiRequired}
                />
              }
              label={
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                  He leído y acepto los &nbsp;
                  <Link
                    component={RouterLink}
                    underline="always"
                    color="info.main"
                    to={PUBLIC_PATHS.policies}
                    target="_blank"
                  >
                    Términos y condiciones
                  </Link>
                  &nbsp; & &nbsp;
                  <Link
                    component={RouterLink}
                    underline="always"
                    color="info.main"
                    to={PUBLIC_PATHS.privacy}
                    target="_blank"
                  >
                    Acuerdos de privacidad
                  </Link>
                  .
                </Typography>
              }
            />
          </Stack>

          <Stack sx={{ px: 5 }}>
            <LoadingButton
              size="large"
              loading={isSubmitting}
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              startIcon={<VerifiedUser />}
            >
              Registrar
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Stack>
  )
}
