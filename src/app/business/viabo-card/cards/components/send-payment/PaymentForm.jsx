import { useEffect } from 'react'

import { Send } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { InputAdornment, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'

import { FormProvider, RFTextField } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'

const MIN_AMOUNT = 0
const MAX_AMOUNT = 2000
const STEP = 100

export function PaymentForm({ balance, setCurrentBalance, insufficient, setShowQR }) {
  const formik = useFormik({
    initialValues: {
      amount: ''
    },
    onSubmit: values => {
      setTimeout(() => {
        setShowQR(true)
      }, 3000)
    }
  })

  const { isSubmitting, values } = formik

  const { amount } = values

  useEffect(() => {
    const value = amount === '' ? 0 : amount
    setCurrentBalance(parseFloat(balance) - parseFloat(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount])

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <FormProvider formik={formik}>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Ingresa La Cantidad (Máximo ${MAX_AMOUNT}.00)
          </Typography>
          <Stack flexDirection={'row'} gap={1} alignItems={'center'} justifyContent={'center'}>
            <RFTextField
              fullWidth
              placeholder={'0.00'}
              name={'amount'}
              type={'number'}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                startAdornment: <span style={{ marginRight: '5px' }}>$</span>,
                endAdornment: <InputAdornment position="end">MXN</InputAdornment>
              }}
              inputProps={{ inputMode: 'numeric', step: 'any', min: MIN_AMOUNT }}
            />
          </Stack>

          <Stack>
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              color="primary"
              disabled={amount <= 0 || insufficient}
              fullWidth
              type="submit"
              startIcon={<Send />}
            >
              Enviar
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Scrollbar>
  )
}
