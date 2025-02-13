import React, { useEffect } from 'react'

import PropTypes from 'prop-types'

import { ArrowForwardIos } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ButtonViaboSpei } from '@/app/business/viabo-spei/shared/components'
import { FormProvider, MaskedInput, RFTextField } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'

const SpeiOutConcentratorForm = ({ selectedAccount, setCurrentBalance, insufficient, onSuccess, initialValues }) => {
  const RegisterSchema = Yup.object().shape({
    concept: Yup.string()
      .trim()
      .optional()
      .max(40, 'El concepto debe tener como máximo 40 caracteres')
      .matches(/^[a-zA-Z0-9\s]+$/, 'El concepto no debe contener caracteres especiales, acentos, ni la letra ñ')
  })

  const formik = useFormik({
    initialValues: initialValues || {
      transactions: [],
      amount: '',
      concept: ''
    },
    validateOnChange: false,
    validationSchema: RegisterSchema,
    onSubmit: (values, { setFieldValue, setSubmitting }) => {
      setSubmitting(false)
      setFieldValue('amount', '')
      return onSuccess({ ...values, origin: selectedAccount?.account?.number })
    }
  })

  const { isSubmitting, setFieldValue, values, handleSubmit } = formik

  const loading = isSubmitting

  const crypto = window.crypto || window.msCrypto

  const array = new Uint32Array(1)

  const random = crypto.getRandomValues(array)[0]

  const isDisabled = values?.amount === '' || Number(values?.amount) <= 0

  useEffect(() => {
    const totalAmount = values.transactions?.reduce((accumulator, currentObject) => {
      const amountValue = currentObject.amount.trim() !== '' ? parseFloat(currentObject.amount.replace(/,/g, '')) : 0

      if (!isNaN(amountValue)) {
        return accumulator + amountValue
      } else {
        return accumulator
      }
    }, 0)

    const currentBalance = totalAmount.toFixed(2)

    setCurrentBalance(currentBalance)
  }, [values.transactions])

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <FormProvider formik={formik}>
        <Stack sx={{ p: 3 }} spacing={3}>
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
                    setFieldValue('transactions', [
                      {
                        id: random,
                        account: { clabe: selectedAccount?.concentrator?.number, name: 'ENVIÓ A CONCENTRADORA' },
                        amount: values?.amount
                      }
                    ])
                  }
                }
              }}
            />
          </Stack>

          <RFTextField
            fullWidth
            name={'concept'}
            multiline
            disabled={loading}
            rows={2}
            label={'Concepto'}
            placeholder={'Transferencia ..'}
          />

          <Stack sx={{ pt: 3 }}>
            <ButtonViaboSpei
              variant="contained"
              size="large"
              color="primary"
              disabled={isDisabled}
              fullWidth
              type={'submit'}
              startIcon={<ArrowForwardIos />}
            >
              Siguiente
            </ButtonViaboSpei>
          </Stack>
        </Stack>
      </FormProvider>
    </Scrollbar>
  )
}

SpeiOutConcentratorForm.propTypes = {
  initialValues: PropTypes.shape({
    transactions: PropTypes.array,
    amount: PropTypes.string,
    concept: PropTypes.string
  }),
  insufficient: PropTypes.any,
  onSuccess: PropTypes.func,
  selectedAccount: PropTypes.shape({
    account: PropTypes.shape({
      number: PropTypes.any
    }),
    concentrator: PropTypes.shape({
      number: PropTypes.any
    })
  }),
  setCurrentBalance: PropTypes.func
}

export default SpeiOutConcentratorForm
