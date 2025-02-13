import PropTypes from 'prop-types'

import { CreditCard, EmailOutlined, Lock, Person, VpnKey } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { InputAdornment, Link, Paper, Stack, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { isAfter, isValid } from 'date-fns'
import { useFormik } from 'formik'
import { MuiTelInput } from 'mui-tel-input'
import { Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'

import { ChargePaymentAdapter } from '../adapters'
import { useCreatePaymentCharge } from '../hooks'

import { PUBLIC_PATHS } from '@/routes'
import { FormProvider, MaskedInput, RFTextField } from '@/shared/components/form'
import { MasterCardLogo, VisaLogo } from '@/shared/components/images'

export const ChargePaymentForm = ({ details }) => {
  const { mutate } = useCreatePaymentCharge(details?.id)

  const CardSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .transform((value, originalValue) => originalValue.replace(/\s/g, '')) // Elimina los espacios en blanco
      .min(16, 'Debe contener 16 dígitos')
      .required('El número de la tarjeta es requerido'),
    cvv: Yup.string().min(3, 'Debe contener 3 dígitos').required('El CVV es requerido'),
    expiration: Yup.string()
      .nullable()
      .required('La fecha de vencimiento es requerida')
      .test('is-future-date', 'La fecha  debe ser mayor que la fecha actual', function (value) {
        const date = new Date(value)
        const isDateValid = isValid(date)
        const currentDate = new Date()
        return isDateValid && isAfter(date, currentDate)
      }),
    name: Yup.string().required('El nombre es requerido'),
    email: Yup.string().email('Ingresa un correo valido').required('El correo es requerido'),
    phone: Yup.string()
      .test('longitud', 'El teléfono es muy corto', value => !(value && value.replace(/[\s+]/g, '').length < 10))
      .required('El teléfono es requerido')
  })

  const formik = useFormik({
    initialValues: {
      cardNumber: '',
      expiration: null,
      cvv: '',
      name: '',
      email: details?.email || '',
      phone: details?.phone || ''
    },
    enableReinitialize: true,
    validationSchema: CardSchema,
    onSubmit: (values, { setSubmitting, setFieldTouched }) => {
      const data = ChargePaymentAdapter(values, details)
      mutate(data, {
        onSuccess: () => {
          setSubmitting(false)
        },
        onError: () => {
          setSubmitting(false)
          setFieldValue('cvv', '').then(() => {
            setFieldTouched('cvv', false, false)
          })
          setFieldValue('expiration', null).then(() => {
            setFieldTouched('expiration', false, false)
          })
        }
      })
    }
  })

  const { errors, touched, isSubmitting, setFieldValue, values } = formik

  const loading = isSubmitting

  return (
    <FormProvider formik={formik}>
      <Stack spacing={3}>
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography variant="h6">Forma de Pago</Typography>
          <Paper sx={{ px: 1 }}>
            <MasterCardLogo sx={{ width: 30, height: 30 }} />
          </Paper>
          <Paper sx={{ px: 1 }}>
            <VisaLogo sx={{ width: 30, height: 30 }} />
          </Paper>
        </Stack>

        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Número de Tarjeta *
          </Typography>
          <RFTextField
            autoFocus
            name={'cardNumber'}
            required={true}
            placeholder={'5254 2700 9717 8968'}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCard />
                </InputAdornment>
              ),
              inputComponent: MaskedInput,
              inputProps: {
                mask: '0000 0000 0000 0000',
                value: values.cardNumber,
                onAccept: value => {
                  setFieldValue('cardNumber', value)
                }
              }
            }}
            disabled={loading}
          />
        </Stack>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} display={'flex'}>
          <Stack flex={1} spacing={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Vence *
            </Typography>
            <DatePicker
              disabled={loading}
              views={['year', 'month']}
              name={'expiration'}
              value={values?.expiration ? new Date(values.expiration) : null}
              required={true}
              onChange={newValue => {
                setFieldValue('expiration', newValue)
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: Boolean(errors.expiration),
                  required: true,
                  helperText: errors.expiration ? errors.expiration : ''
                }
              }}
              disablePast={true}
              minDate={new Date()}
              format="MM/yy"
            />
          </Stack>
          <Stack spacing={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              CVV *
            </Typography>
            <RFTextField
              name={'cvv'}
              required={true}
              placeholder={'123'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey />
                  </InputAdornment>
                ),
                inputComponent: MaskedInput,
                inputProps: {
                  mask: '000',
                  onAccept: value => {
                    setFieldValue('cvv', value)
                  },
                  value: values.cvv
                }
              }}
              disabled={loading}
            />
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Tarjetahabiente *
          </Typography>

          <RFTextField
            name={'name'}
            required={true}
            placeholder={'Nombre del Titular de la Tarjeta'}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              )
            }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Correo Electrónico *
          </Typography>

          <RFTextField
            name={'email'}
            required={true}
            placeholder={'usuario@dominio.com'}
            disabled={loading}
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
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Telefono *
          </Typography>

          <MuiTelInput
            name="phone"
            fullWidth
            langOfCountryName="es"
            defaultCountry="MX"
            preferredCountries={['MX', 'US']}
            continents={['NA', 'SA']}
            forceCallingCode
            value={values.phone}
            disabled={loading}
            required={true}
            onChange={(value, info) => {
              setFieldValue('phone', value)
            }}
            error={touched.phone && Boolean(errors.phone)}
            helperText={touched.phone && errors.phone}
          />
        </Stack>

        <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
          Al hacer clic en el botón de Pagar, accedo a los &nbsp;
          <Link component={RouterLink} underline="always" color="info.main" to={PUBLIC_PATHS.policies} target="_blank">
            Términos y condiciones
          </Link>
          &nbsp; & &nbsp;
          <Link component={RouterLink} underline="always" color="info.main" to={PUBLIC_PATHS.privacy} target="_blank">
            Acuerdos de privacidad
          </Link>
          .
        </Typography>

        <Stack>
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            startIcon={<Lock />}
          >
            Pagar
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

ChargePaymentForm.propTypes = {
  details: PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.any,
    phone: PropTypes.string
  })
}
