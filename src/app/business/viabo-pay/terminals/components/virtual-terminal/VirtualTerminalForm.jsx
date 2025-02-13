import PropTypes from 'prop-types'

import { CreditCard, EmailOutlined, Lock, Person, Phone, VpnKey } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { InputAdornment, Link, MenuItem, Paper, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'

import { PaymentByVirtualTerminalAdapter } from '../../adapters'
import { useGeneratePaymentByVirtualTerminal } from '../../hooks'
import { useTerminalDetails } from '../../store'

import { PUBLIC_PATHS } from '@/routes'
import { FormProvider, MaskedInput, RFSimpleSelect, RFTextField } from '@/shared/components/form'
import { MasterCardLogo, VisaLogo } from '@/shared/components/images'
import { monthOptions } from '@/shared/utils'

const MIN_AMOUNT = 1
const MAX_AMOUNT = 100000

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()
const yearsToAdd = 10

const yearOptions = Array.from({ length: yearsToAdd }, (_, index) => currentYear + index)

export const VirtualTerminalForm = ({ onSuccessTransaction }) => {
  const terminal = useTerminalDetails(state => state.terminal)

  const { mutate } = useGeneratePaymentByVirtualTerminal()

  const TerminalSchema = Yup.object().shape({
    amount: Yup.string().required('El monto es requerido'),
    concept: Yup.string().required('El concepto es requerido'),
    cardNumber: Yup.string()
      .transform((value, originalValue) => originalValue.replace(/\s/g, '')) // Elimina los espacios en blanco
      .min(16, 'Debe contener 16 dígitos')
      .required('El número de la tarjeta es requerido'),
    cvv: Yup.string().min(3, 'Debe contener 3 dígitos').required('El CVV es requerido'),
    name: Yup.string().required('El nombre es requerido'),
    email: Yup.string().email('Ingresa un correo valido').required('El correo es requerido'),
    phone: Yup.string()
      .test('longitud', 'El teléfono es muy corto', value => !(value && value.replace(/\s/g, '').length < 10))
      .required('El teléfono es requerido')
  })

  const formik = useFormik({
    initialValues: {
      amount: '',
      cardNumber: '',
      month: currentMonth,
      year: currentYear,
      cvv: '',
      name: '',
      email: '',
      phone: '',
      concept: ''
    },
    enableReinitialize: true,
    validationSchema: TerminalSchema,
    onSubmit: (values, { setSubmitting, setFieldTouched }) => {
      const data = PaymentByVirtualTerminalAdapter(terminal, values)

      mutate(data, {
        onSuccess: () => {
          setSubmitting(false)
          onSuccessTransaction()
        },
        onError: () => {
          setSubmitting(false)
          setFieldValue('cvv', '').then(() => {
            setFieldTouched('cvv', false, false)
          })
        }
      })
    }
  })

  const { isSubmitting, setFieldValue, values } = formik

  const loading = isSubmitting

  return (
    <FormProvider formik={formik}>
      <Stack spacing={2} p={3}>
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography variant="subtitle1">Forma de Pago</Typography>
          <Paper sx={{ px: 1, backgroundColor: 'background.neutral' }}>
            <MasterCardLogo sx={{ width: 30, height: 30 }} />
          </Paper>
          <Paper sx={{ px: 1, backgroundColor: 'background.neutral' }}>
            <VisaLogo sx={{ width: 30, height: 30 }} />
          </Paper>
        </Stack>
        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Monto *
          </Typography>

          <RFTextField
            autoFocus
            fullWidth
            name={'amount'}
            required={true}
            placeholder={'0.00'}
            disabled={loading}
            size={'small'}
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
            Concepto *
          </Typography>

          <RFTextField
            size={'small'}
            name={'concept'}
            multiline
            disabled={loading}
            rows={2}
            placeholder={'Pago por ..'}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Número de Tarjeta *
          </Typography>
          <RFTextField
            name={'cardNumber'}
            required={true}
            size={'small'}
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
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} display={'flex'} flexWrap={'wrap'}>
          <Stack flex={1} spacing={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Mes *
            </Typography>
            <RFSimpleSelect size={'small'} name={'month'} disabled={loading}>
              {monthOptions.map((month, index) => (
                <MenuItem key={index} value={index}>
                  {month}
                </MenuItem>
              ))}
            </RFSimpleSelect>
          </Stack>
          <Stack flex={1} spacing={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Año *
            </Typography>
            <RFSimpleSelect size={'small'} name={'year'} disabled={loading}>
              {yearOptions.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </RFSimpleSelect>
          </Stack>
          <Stack flex={1} spacing={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              CVV *
            </Typography>
            <RFTextField
              name={'cvv'}
              required={true}
              placeholder={'123'}
              size={'small'}
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
            size={'small'}
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
            size={'small'}
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
            Teléfono *
          </Typography>

          <RFTextField
            name={'phone'}
            required={true}
            type={'phone'}
            size={'small'}
            placeholder={'55 5555 5555'}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
              inputComponent: MaskedInput,
              inputProps: {
                mask: '00 0000 0000',
                value: values.phone,
                onAccept: value => {
                  setFieldValue('phone', value)
                }
              }
            }}
            disabled={loading}
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

VirtualTerminalForm.propTypes = {
  onSuccessTransaction: PropTypes.func
}
