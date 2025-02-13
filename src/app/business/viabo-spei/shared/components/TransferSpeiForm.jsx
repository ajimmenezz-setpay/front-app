import { useEffect, useRef } from 'react'

import { ArrowForwardIos, Delete } from '@mui/icons-material'
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import { stringAvatar } from '@theme/utils'
import { FieldArray, useFormik } from 'formik'
import * as Yup from 'yup'

import { ButtonViaboSpei, borderColorViaboSpeiStyle } from '@/app/business/viabo-spei/shared/components'
import { IconButtonAnimate } from '@/shared/components/animate'
import { FormProvider, MaskedInput, RFTextField } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'

const TransferSpeiForm = ({ stateValues, originAccount, onSuccess, setCurrentBalance, initialAccounts }) => {
  const arrayHelpersRef = useRef(null)

  const RegisterSchema = Yup.object().shape({
    transactions: Yup.array().of(
      Yup.object().shape({
        amount: Yup.string()
          .required('Es necesario el monto')
          .test('minAmount', 'El monto mínimo es de $1.00', function (value) {
            return parseFloat(value?.replace(/,/g, '')) >= 1
          })
      })
    ),
    concept: Yup.string()
      .trim()
      .optional()
      .max(40, 'El concepto debe tener como máximo 40 caracteres')
      .matches(/^[a-zA-Z0-9\s]+$/, 'El concepto no debe contener caracteres especiales, acentos, ni la letra ñ')
  })

  const formik = useFormik({
    initialValues: stateValues || {
        transactions: initialAccounts,
        concept: ''
      } || {
        transactions: [],
        concept: ''
      },
    validateOnChange: false,
    validationSchema: RegisterSchema,
    onSubmit: (values, { setFieldValue, setSubmitting }) => {
      setSubmitting(false)
      return onSuccess({ ...values, origin: originAccount?.account?.number })
    }
  })

  const { isSubmitting, setFieldValue, values } = formik

  const loading = isSubmitting

  useEffect(() => {
    const totalAmount = values.transactions?.reduce((accumulator, currentObject) => {
      const amountValue =
        currentObject?.amount?.trim() !== '' ? parseFloat(currentObject?.amount?.replace(/,/g, '')) : 0

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
        <Stack sx={{ p: 3 }} gap={2}>
          <FieldArray
            name="transactions"
            render={arrayHelpers => {
              arrayHelpersRef.current = arrayHelpers
              return (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {values?.transactions.map((item, index) => {
                    const amount = `transactions[${index}].amount`

                    return (
                      <Stack key={item.id} gap={2}>
                        <ListItem
                          sx={{ px: 0, pb: 0 }}
                          secondaryAction={
                            values?.transactions?.length > 1 && (
                              <IconButtonAnimate
                                color={'error'}
                                edge="end"
                                aria-label="delete"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <Delete />
                              </IconButtonAnimate>
                            )
                          }
                        >
                          <ListItemAvatar>
                            <Avatar
                              title={item?.account?.label || ''}
                              {...stringAvatar(item?.account?.label || '')}
                            ></Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1">
                                {item?.account?.label} {item?.account?.clabeHidden}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <RFTextField
                          size={'small'}
                          name={amount}
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
                              value: item.amount,
                              onAccept: value => {
                                setFieldValue(amount, value)
                              }
                            },
                            sx: {
                              borderRadius: theme => Number(1),
                              borderColor: borderColorViaboSpeiStyle
                            }
                          }}
                        />
                        <Divider variant="inset" component="li" sx={{ ml: 0, borderStyle: 'dashed' }} />
                      </Stack>
                    )
                  })}
                </List>
              )
            }}
          />

          <RFTextField
            fullWidth
            name={'concept'}
            multiline
            disabled={loading}
            rows={2}
            label={'Concepto'}
            placeholder={'Transferencia ..'}
            InputProps={{
              sx: {
                borderRadius: theme => Number(1),
                borderColor: borderColorViaboSpeiStyle
              }
            }}
          />

          <Stack sx={{ pt: 3 }}>
            <ButtonViaboSpei
              variant="contained"
              size="large"
              color="primary"
              disabled={!!values?.transactions?.length <= 0}
              fullWidth
              type="submit"
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

export default TransferSpeiForm
