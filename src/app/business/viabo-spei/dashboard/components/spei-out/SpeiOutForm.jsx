import { useEffect, useRef } from 'react'

import PropTypes from 'prop-types'

import { Add, ArrowForwardIos, Delete } from '@mui/icons-material'
import {
  Avatar,
  Box,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { stringAvatar } from '@theme/utils'
import { FieldArray, useFormik } from 'formik'
import * as Yup from 'yup'

import { ButtonViaboSpei } from '@/app/business/viabo-spei/shared/components'
import { IconButtonAnimate } from '@/shared/components/animate'
import { FormProvider, MaskedInput, RFSelect, RFTextField } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'

const SpeiOutForm = ({
  selectedAccount,
  accounts,
  setCurrentBalance,
  onSuccess,
  initialValues,
  layoutTransactions
}) => {
  const arrayHelpersRef = useRef(null)

  const crypto = window.crypto || window.msCrypto

  const array = new Uint32Array(1)

  const random = crypto.getRandomValues(array)[0]

  const RegisterSchema = Yup.object().shape({
    transactions: Yup.array().of(
      Yup.object().shape({
        amount: Yup.string().required('La cantidad es requerida'),
        account: Yup.object().nullable().required('La cuenta es requerida')
      })
    ),
    concept: Yup.string()
      .trim()
      .optional()
      .max(40, 'El concepto debe tener como máximo 40 caracteres')
      .matches(/^[a-zA-Z0-9\s]+$/, 'El concepto no debe contener caracteres especiales, acentos, ni la letra ñ')
  })

  const formik = useFormik({
    initialValues: initialValues || {
      transactions: [],
      beneficiary: null,
      amount: '',
      concept: ''
    },
    validateOnChange: false,
    validationSchema: RegisterSchema,
    onSubmit: (values, { setFieldValue, setSubmitting }) => {
      setSubmitting(false)
      setFieldValue('amount', '')
      setFieldValue('beneficiary', null)
      return onSuccess({ ...values, origin: selectedAccount?.account?.number })
    }
  })

  const { isSubmitting, setFieldValue, values } = formik

  const loading = isSubmitting
  const isDisabled = !values?.beneficiary || values?.amount === '' || Number(values?.amount) <= 0

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

  const handleResetForm = () => {
    setFieldValue('amount', '')
    setFieldValue('beneficiary', null)
  }

  useEffect(() => {
    if (layoutTransactions?.length > 0) {
      setFieldValue('transactions', [...values.transactions, ...layoutTransactions])
    }
  }, [layoutTransactions])

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <FormProvider formik={formik}>
        <Stack sx={{ p: 3 }}>
          <Stack gap={2}>
            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={'bold'}>
                Beneficiario:
              </Typography>
              <RFSelect
                name={'beneficiary'}
                disabled={loading}
                textFieldParams={{
                  placeholder: 'Seleccionar ...',
                  size: 'large'
                }}
                options={accounts || []}
                onChange={(e, value) => {
                  setFieldValue('beneficiary', value)
                }}
                renderOption={(props, option) => {
                  const avatar = stringAvatar(option?.label || '')
                  return (
                    <Box component="li" {...props} key={props.key}>
                      <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <Avatar {...avatar} sx={{ ...avatar?.sx, width: 25, height: 25, fontSize: 12 }}></Avatar>
                        <span>{option.label}</span>
                      </Stack>
                    </Box>
                  )
                }}
                renderInput={params => {
                  const avatar = stringAvatar(params?.inputProps?.value || '')

                  return (
                    <TextField
                      {...params}
                      size="large"
                      placeholder="Seleccionar ..."
                      inputProps={{
                        ...params.inputProps
                      }}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Avatar {...avatar} sx={{ ...avatar?.sx, width: 25, height: 25, fontSize: 12 }}></Avatar>
                          </InputAdornment>
                        )
                      }}
                    />
                  )
                }}
              />
            </Stack>
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
                    }
                  }
                }}
              />
            </Stack>

            <Stack direction={'row'} spacing={1}>
              <ButtonViaboSpei
                type="button"
                startIcon={<Add />}
                disabled={loading || isDisabled}
                onClick={() => {
                  arrayHelpersRef.current.push({
                    id: random,
                    account: values?.beneficiary,
                    amount: values?.amount
                  })
                  const account = accounts?.find(account => account?.id === values?.beneficiary?.id)
                  if (account) {
                    account.isDisabled = true
                  }

                  handleResetForm()
                }}
                sx={{ flexShrink: 0, color: 'text.primary' }}
              >
                Agregar Transacción
              </ButtonViaboSpei>
            </Stack>
          </Stack>

          <FieldArray
            name="transactions"
            render={arrayHelpers => {
              arrayHelpersRef.current = arrayHelpers
              return (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {values?.transactions.map((item, index) => (
                    <Stack key={item.id}>
                      <ListItem
                        sx={{ px: 0 }}
                        secondaryAction={
                          <IconButtonAnimate
                            color={'error'}
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              arrayHelpers.remove(index)
                              const account = accounts?.find(account => account?.id === item?.account?.id)
                              if (account) {
                                account.isDisabled = false
                              }
                            }}
                          >
                            <Delete />
                          </IconButtonAnimate>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            title={item?.account?.label || ''}
                            {...stringAvatar(item?.account?.label || '')}
                          ></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="subtitle1">{item?.account?.clabeHidden}</Typography>}
                          secondary={
                            <Typography variant="subtitle1" fontWeight={'bold'}>
                              {item?.amount}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Stack>
                  ))}
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

SpeiOutForm.propTypes = {
  accounts: PropTypes.array,
  layoutTransactions: PropTypes.array,
  initialValues: PropTypes.shape({
    amount: PropTypes.string,
    beneficiary: PropTypes.any,
    concept: PropTypes.string,
    transactions: PropTypes.array
  }),
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

export default SpeiOutForm
