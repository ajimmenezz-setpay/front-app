import PropTypes from 'prop-types'

import { ArrowForwardIos, CreditCard } from '@mui/icons-material'
import { Button, Chip, Stack } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { FormProvider, MaskedInput, RFTextField } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'

function TransferToGlobalForm({ setCurrentBalance, insufficient, mainCard, onSuccess }) {
  const RegisterSchema = Yup.object().shape({
    amount: Yup.string()
      .required('La cantidad es requerida')
      .test('maxAmount', 'Monto máximo de transferencia $50,000', function (value) {
        return parseFloat(value?.replace(/,/g, '')) <= 50000
      })
  })

  const formik = useFormik({
    initialValues: {
      card: mainCard ? { label: mainCard?.label, value: mainCard?.id } : null,
      amount: '',
      concept: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (insufficient) {
        return setSubmitting(false)
      }
      setSubmitting(false)
      return onSuccess(values)
    }
  })
  const { isSubmitting, setFieldValue, values } = formik

  const loading = isSubmitting

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <FormProvider formik={formik}>
        <Stack sx={{ p: 3 }} spacing={1}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ width: 1 }}
            alignItems={'flex-start'}
            justifyContent={'center'}
          >
            <Chip icon={<CreditCard />} label={mainCard?.cardNumberHidden} />
          </Stack>
          <Stack>
            <RFTextField
              sx={{ width: 1 }}
              size={'small'}
              name={'amount'}
              required={true}
              label={'Cantidad'}
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
                    setCurrentBalance(parseFloat(value === '' ? '0' : value.replace(/,/g, '')).toFixed(2))
                    setFieldValue('amount', value)
                  }
                }
              }}
            />
          </Stack>
          <Stack sx={{ width: 1 }}>
            <RFTextField
              name={'concept'}
              multiline
              disabled={loading}
              rows={2}
              label={'Concepto'}
              placeholder={'Transferencia ..'}
            />
          </Stack>

          <Stack sx={{ px: 3, pt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              disabled={insufficient}
              fullWidth
              type="submit"
              startIcon={<ArrowForwardIos />}
            >
              Siguiente
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Scrollbar>
  )
}

export default TransferToGlobalForm

TransferToGlobalForm.propTypes = {
  insufficient: PropTypes.any,
  mainCard: PropTypes.shape({
    cardNumberHidden: PropTypes.any,
    id: PropTypes.any,
    label: PropTypes.any
  }),
  onSuccess: PropTypes.func,
  setCurrentBalance: PropTypes.func
}
