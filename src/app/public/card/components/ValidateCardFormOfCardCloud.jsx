import { CreditCard, PasswordTwoTone } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { InputAdornment, Stack } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { isAfter, isValid } from 'date-fns'
import { useFormik } from 'formik'
import { motion } from 'framer-motion'
import * as Yup from 'yup'

import { ValidateCardOfCardCloudAdapter } from '../adapters'
import { useValidateCardOfCardCloud } from '../hooks'

import { FormLabelTypography, FormProvider, MaskedInput, RFPasswordField, RFTextField } from '@/shared/components/form'
import { isFunction } from '@/shared/utils'

const ValidateCardFormOfCardCloud = ({ onSuccess }) => {
  const { mutate, isLoading } = useValidateCardOfCardCloud()

  const CardSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .transform((value, originalValue) => originalValue.replace(/\s/g, ''))
      .min(8, 'Debe contener los últimos 8 dígitos')
      .required('Es necesario el número de la tarjeta'),
    nip: Yup.string()
      .trim()
      .matches(/^0*\d{4}$/, 'El nip debe contener 4 dígitos')
      .required('Es necesario el NIP'),
    expiration: Yup.string()
      .nullable()
      .required('Es necesario la fecha de vencimiento')
      .test('is-future-date', 'La fecha  debe ser mayor que la fecha actual', function (value) {
        const date = new Date(value)
        const isDateValid = isValid(date)
        const currentDate = new Date()
        return isDateValid && isAfter(date, currentDate)
      })
  })

  const formik = useFormik({
    initialValues: {
      cardNumber: '',
      nip: '',
      expiration: null
    },
    enableReinitialize: true,
    validationSchema: CardSchema,
    onSubmit: (values, { setSubmitting }) => {
      const data = ValidateCardOfCardCloudAdapter(values)
      mutate(data, {
        onSuccess: data => {
          isFunction(onSuccess) && onSuccess(data)
          setSubmitting(false)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { isSubmitting, values, setFieldValue, handleSubmit, errors } = formik

  const loading = isSubmitting || isLoading

  return (
    <motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <FormProvider formik={formik}>
        <Stack gap={3}>
          <Stack gap={1}>
            <FormLabelTypography required fontWeight={'bold'}>
              Ingrese los 8 últimos dígitos de su tarjeta
            </FormLabelTypography>

            <RFTextField
              name={'cardNumber'}
              required
              placeholder={'9717 8968'}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCard />
                  </InputAdornment>
                ),
                inputComponent: MaskedInput,
                inputProps: {
                  mask: '0000 0000',
                  value: values.cardNumber,
                  onAccept: value => {
                    setFieldValue('cardNumber', value)
                  }
                }
              }}
              disabled={loading}
            />
          </Stack>

          <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            <Stack gap={1} flex={1}>
              <FormLabelTypography noWrap required fontWeight={'bold'}>
                Ingrese el NIP
              </FormLabelTypography>

              <RFPasswordField
                name={'nip'}
                required
                placeholder={'4 dígitos'}
                inputProps={{ maxLength: '4' }}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordTwoTone />
                    </InputAdornment>
                  )
                }}
                disabled={loading}
              />
            </Stack>

            <Stack gap={1} flex={1}>
              <FormLabelTypography noWrap required fontWeight={'bold'}>
                Ingrese fecha de vencimiento
              </FormLabelTypography>
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
          </Stack>

          <Stack mt={2}>
            <LoadingButton
              loading={loading}
              variant="contained"
              size="large"
              color="primary"
              fullWidth
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              Validar
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </motion.div>
  )
}

export default ValidateCardFormOfCardCloud
