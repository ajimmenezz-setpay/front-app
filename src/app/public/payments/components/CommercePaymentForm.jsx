import { memo } from 'react'

import PropTypes from 'prop-types'

import { CreditCard, EmailOutlined, GppGoodTwoTone, LocalAtmOutlined, Person, Phone, VpnKey } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { PaymentByCashAdapter, PaymentByTerminalAdapter } from '../adapters'
import { usePayWithCashMethod, usePayWithTerminalMethod } from '../hooks'
import { usePublicPaymentStore } from '../store'

import { FormProvider, MaskedInput, RFSimpleSelect, RFTextField } from '@/shared/components/form'
import { getCryptInfo, monthOptions } from '@/shared/utils'

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()
const yearsToAdd = 10

const yearOptions = Array.from({ length: yearsToAdd }, (_, index) => currentYear + index)

const CommercePaymentForm = ({ onSuccess }) => {
  const { commerce } = usePublicPaymentStore(state => state)
  const { mutate: payByCash, isLoading: loadingByCash } = usePayWithCashMethod()
  const { mutate: payByTerminal, isLoading: loadingByTerminal } = usePayWithTerminalMethod()

  const CardSchema = Yup.object().shape({
    name: Yup.string().required('Es necesario un nombre'),
    email: Yup.string().email('Ingresa un correo valido').required('Es necesario un correo'),
    phone: Yup.string()
      .test('longitud', 'El teléfono es muy corto', value => !(value && value.replace(/\s/g, '').length < 10))
      .required('Es necesario un teléfono'),
    amount: Yup.string()
      .test('maxAmount', 'Monto máximo de $50,000', function (value) {
        const parsedValue = parseFloat(value?.replace(/,/g, ''))
        return !isNaN(parsedValue) && parsedValue <= 50000
      })
      .test('minAmount', 'Monto mínimo de $1.00', function (value) {
        const parsedValue = parseFloat(value?.replace(/,/g, ''))
        return !isNaN(parsedValue) && parsedValue >= 1.0
      })
      .required('Es necesario un monto'),
    concept: Yup.string().trim().required('Es necesario un concepto'),
    cardNumber: Yup.string().when('paymentType', {
      is: 'terminal',
      then: schema =>
        Yup.string()
          .transform((value, originalValue) => originalValue.replace(/\s/g, '')) // Elimina los espacios en blanco
          .min(16, 'El número de tarjeta debe tener 16 dígitos')
          .required('Es necesario un número de tarjeta')
    }),

    cvv: Yup.string().when('paymentType', {
      is: 'terminal',
      then: schema =>
        Yup.string()
          .required('Es necesario un CVV')
          .matches(/^\d{3}$/, 'El CVV debe tener 3 dígitos')
    })
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      amount: '',
      paymentType: 'cash',
      cardNumber: '',
      month: currentMonth,
      year: currentYear,
      cvv: '',
      concept: ''
    },
    enableReinitialize: true,
    validationSchema: CardSchema,
    onSubmit: (values, { setSubmitting, setFieldTouched }) => {
      if (values?.paymentType === 'terminal') {
        const data = PaymentByTerminalAdapter(values, commerce)
        payByTerminal(getCryptInfo(data), {
          onSuccess: () => {
            setSubmitting(false)
            onSuccess(data)
          },
          onError: () => {
            setSubmitting(false)
          }
        })
      } else if (values?.paymentType === 'cash') {
        const data = PaymentByCashAdapter(values, commerce)
        payByCash(getCryptInfo(data), {
          onSuccess: paymentInstructions => {
            setSubmitting(false)
            onSuccess({ ...data, ...paymentInstructions })
          },
          onError: () => {
            setSubmitting(false)
          }
        })
      } else {
        toast.error('Algo salio mal al procesar el pago. Intente nuevamente o reporte a sistemas')
        setSubmitting(false)
      }
    }
  })

  const { isSubmitting, setFieldValue, values } = formik
  const loading = isSubmitting || loadingByCash || loadingByTerminal

  const getButtonText = () => {
    if (values.amount !== '') {
      return values.paymentType === 'cash' ? `Generar Referencia` : `Pagar $${values.amount}`
    }
    return values.paymentType === 'cash' ? 'Generar Referencia' : 'Pagar'
  }

  return (
    <Stack flex={1}>
      <FormProvider formik={formik}>
        <Stack>
          <Stack spacing={3} p={3}>
            <Typography variant="subtitle1">
              Completa el siguiente formulario y realiza tu pago de una manera fácil y segura
            </Typography>
            <RFTextField
              name={'name'}
              required={true}
              label="Nombre"
              placeholder={'Nombre'}
              disabled={loading}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                )
              }}
            />

            <RFTextField
              name={'email'}
              fullWidth
              required={true}
              label="Correo Electrónico"
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

            <RFTextField
              name={'phone'}
              required={true}
              type={'phone'}
              label="Teléfono"
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

            <RFTextField
              fullWidth
              name={'amount'}
              required={true}
              label={'Monto a enviar'}
              placeholder={'0.00'}
              disabled={loading}
              autoComplete={'off'}
              InputProps={{
                startAdornment: <span style={{ marginRight: '5px' }}>$</span>,
                inputComponent: MaskedInput,
                inputProps: {
                  mask: Number,
                  radix: '.',
                  thousandsSeparator: ',',
                  padFractionalZeros: true,
                  min: 0,
                  scale: 2,
                  value: values.amount,
                  onAccept: value => {
                    setFieldValue('amount', value)
                  }
                }
              }}
            />

            <RFTextField name={'concept'} fullWidth required={true} label="Concepto" disabled={loading} />
          </Stack>

          <Divider />

          <Stack spacing={3} p={3}>
            <Typography variant="subtitle1" fontWeight={'bold'}>
              Selecciona tu método de pago
            </Typography>

            <ToggleButtonGroup
              color="primary"
              value={values.paymentType}
              exclusive
              onChange={(event, newPaymentType) => {
                if (newPaymentType) {
                  setFieldValue('paymentType', newPaymentType)
                }
              }}
              aria-label="Payment Method"
              disabled={loading}
            >
              <ToggleButton fullWidth sx={{ width: 1 }} value="cash">
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <Typography variant="subtitle2">Efectivo</Typography>
                  <LocalAtmOutlined />
                </Stack>
              </ToggleButton>
              {commerce?.information?.publicTerminal && commerce?.information?.publicTerminal !== '' && (
                <ToggleButton fullWidth sx={{ width: 1 }} value="terminal">
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Typography variant="subtitle2">
                      Tarjeta <span style={{ fontStyle: 'italic' }}>(crédito/débito)</span>
                    </Typography>

                    <CreditCard />
                  </Stack>
                </ToggleButton>
              )}
            </ToggleButtonGroup>
          </Stack>

          {values?.paymentType === 'terminal' && (
            <>
              <Divider />
              <Stack spacing={3} p={3}>
                <Typography variant="subtitle1" fontWeight={'bold'}>
                  Ingresar datos de tarjeta
                </Typography>
                <RFTextField
                  name={'cardNumber'}
                  required={true}
                  placeholder={'5254 2700 9717 8968'}
                  fullWidth
                  label={'Número de Tarjeta'}
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
                <Stack flexDirection={{ md: 'row' }} gap={2} flexWrap={true}>
                  <FormControl fullWidth required disabled={loading}>
                    <InputLabel id="month-select-label">Mes</InputLabel>
                    <RFSimpleSelect label={'Mes'} labelId="month-select-label" name={'month'} disabled={loading}>
                      {monthOptions.map((month, index) => (
                        <MenuItem key={index} value={index}>
                          {month}
                        </MenuItem>
                      ))}
                    </RFSimpleSelect>
                  </FormControl>

                  <FormControl fullWidth sx={{ maxWidth: { xs: 'auto', md: 100 } }} required disabled={loading}>
                    <InputLabel id="year-select-label">Año</InputLabel>
                    <RFSimpleSelect labelId="year-select-label" label={'Año'} name={'year'} disabled={loading}>
                      {yearOptions.map(year => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </RFSimpleSelect>
                  </FormControl>

                  <RFTextField
                    name={'cvv'}
                    label={'CVV'}
                    required={true}
                    fullWidth
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
            </>
          )}

          <Stack sx={{ px: 9, pt: 3 }}>
            <LoadingButton
              loading={loading}
              endIcon={<GppGoodTwoTone />}
              type="submit"
              size="large"
              variant="contained"
              sx={{ fontWeight: 'bold' }}
            >
              {getButtonText()}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Stack>
  )
}

CommercePaymentForm.propTypes = {
  onSuccess: PropTypes.func
}

export default memo(CommercePaymentForm)
