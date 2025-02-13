import { useMemo } from 'react'

import { Send } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { AlertTitle, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { AlertWithFocus } from '@/shared/components/alerts'
import { FormProvider, MaskedInput, RFTextField } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'
import { isFunction } from '@/shared/utils'

const TransferToSubAccountForm = ({ onSubmit, isLoading, balance = 0 }) => {
  const RegisterSchema = Yup.object().shape({
    amount: Yup.string()
      .trim()
      .test('minAmount', 'El monto debe ser mayor a $0.00', function (value) {
        return parseFloat(value?.replace(/,/g, '')) > 0
      })
      .required('El monto es requerido'),
    concept: Yup.string().trim().required('El concepto es requerido')
  })

  const formik = useFormik({
    initialValues: {
      amount: '',
      concept: ''
    },
    validationSchema: RegisterSchema,
    validateOnChange: false,
    onSubmit: (values, { setFieldValue, setSubmitting }) => {
      setSubmitting(false)
      isFunction(onSubmit) && onSubmit(values)
    }
  })

  const { setFieldValue, values, errors } = formik

  const loading = isLoading

  const amountNumber = useMemo(
    () => (values.amount.trim() !== '' ? parseFloat(values.amount.replace(/,/g, '')) : 0),
    [values.amount]
  )

  const newBalance = useMemo(() => parseFloat(balance) - parseFloat(amountNumber), [balance, amountNumber])

  const insufficient = useMemo(() => balance <= 0 || newBalance < 0, [balance, newBalance])

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <FormProvider formik={formik}>
        <Stack sx={{ p: 3 }}>
          <Stack gap={2}>
            {insufficient && (
              <AlertWithFocus listenElement={insufficient} severity={'warning'} sx={{ width: 1 }}>
                <AlertTitle>Saldo Insuficiente</AlertTitle>
                <Typography variant="body2">
                  El saldo de la subcuenta es: <b>${balance}</b> y el monto a transferir es :{' '}
                  <b>${values.amount === '' ? '0.00' : values.amount}</b>
                </Typography>
              </AlertWithFocus>
            )}

            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={'bold'}>
                Monto:
              </Typography>
              <RFTextField
                size={'large'}
                name={'amount'}
                placeholder={'0.00'}
                disabled={loading}
                autoComplete={'off'}
                required
                InputProps={{
                  startAdornment: <span style={{ marginRight: '5px' }}>$</span>,
                  endAdornment: <span style={{ marginRight: '5px' }}>MXN</span>,
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
            </Stack>
            <Stack spacing={0.5} pt={2}>
              <RFTextField
                fullWidth
                name={'concept'}
                multiline
                disabled={loading}
                rows={2}
                label={'Concepto'}
                placeholder={'Transferencia ..'}
              />
            </Stack>
          </Stack>

          <Stack sx={{ pt: 3 }}>
            <LoadingButton
              variant="contained"
              size="large"
              color="primary"
              disabled={!!insufficient}
              fullWidth
              type="submit"
              startIcon={<Send />}
              loading={loading}
            >
              Transferir
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Scrollbar>
  )
}

export default TransferToSubAccountForm
