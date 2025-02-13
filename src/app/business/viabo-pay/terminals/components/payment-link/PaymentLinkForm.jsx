import PropTypes from 'prop-types'

import { EmailOutlined, Link, Person } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { InputAdornment, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { MuiTelInput } from 'mui-tel-input'
import * as Yup from 'yup'

import { PaymentLinkAdapter } from '../../adapters'
import { useCreatePaymentLink } from '../../hooks'
import { useTerminalDetails } from '../../store'

import { FormProvider, MaskedInput, RFTextField } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'

const MIN_AMOUNT = 1
const MAX_AMOUNT = 100000
const STEP = 100

export const PaymentLinkForm = ({ onSuccess }) => {
  const { mutate, isLoading } = useCreatePaymentLink()
  const terminal = useTerminalDetails(state => state.terminal)

  const registerValidation = Yup.object({
    amount: Yup.string().required('El monto es requerido'),
    name: Yup.string().required('El nombre es requerido'),
    email: Yup.string().email('Ingresa un correo valido').required('El correo es requerido'),
    phone: Yup.string()
      .test('longitud', 'El telefono es muy corto', value => !(value && value.replace(/[\s+]/g, '').length < 10))
      .required('El telefono es requerido')
  })

  const formik = useFormik({
    initialValues: {
      amount: '',
      name: '',
      email: '',
      phone: '',
      concept: ''
    },
    validationSchema: registerValidation,
    onSubmit: (values, { setSubmitting }) => {
      const data = PaymentLinkAdapter(terminal, values)
      mutate(data, {
        onSuccess: data => {
          setSubmitting(false)
          onSuccess({ id: data?.code, amount: values.amount })
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { errors, touched, isSubmitting, setFieldValue, values } = formik

  const loading = isSubmitting || isLoading

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <FormProvider formik={formik}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Monto * (Máximo $100,000 por liga de pago)
            </Typography>

            <RFTextField
              fullWidth
              name={'amount'}
              required={true}
              placeholder={'0.00'}
              disabled={loading}
              autoComplete={'off'}
              InputProps={{
                startAdornment: <span style={{ marginRight: '5px' }}>$</span>,
                endAdornment: <InputAdornment position="end">MXN</InputAdornment>,
                inputComponent: MaskedInput,
                inputProps: {
                  mask: Number,
                  radix: '.',
                  thousandsSeparator: ',',
                  padFractionalZeros: true,
                  min: MIN_AMOUNT,
                  max: MAX_AMOUNT,
                  scale: 2,
                  value: values.amount,
                  onAccept: value => {
                    setFieldValue('amount', value)
                  }
                }
              }}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Nombre Completo *
            </Typography>

            <RFTextField
              name={'name'}
              required={true}
              placeholder={'Usuario'}
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
              defaultCountry="MX"
              langOfCountryName="es"
              preferredCountries={['MX', 'US']}
              continents={['NA', 'SA']}
              forceCallingCode
              value={values.phone}
              disabled={loading}
              onChange={(value, info) => {
                setFieldValue('phone', value)
              }}
              error={touched.phone && Boolean(errors.phone)}
              helperText={touched.phone && errors.phone}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Mensaje
            </Typography>

            <RFTextField name={'concept'} multiline disabled={loading} rows={2} placeholder={'Pago por ..'} />
          </Stack>

          <Stack>
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              startIcon={<Link />}
            >
              Generar
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Scrollbar>
  )
}

PaymentLinkForm.propTypes = {
  onSuccess: PropTypes.func
}
