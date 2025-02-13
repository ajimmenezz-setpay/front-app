import { useMemo } from 'react'

import { Send } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { AlertTitle, Avatar, Box, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { AlertWithFocus } from '@/shared/components/alerts'
import { FormProvider, MaskedInput, RFSelect, RFTextField } from '@/shared/components/form'
import { MasterCardLogo } from '@/shared/components/images'
import { Scrollbar } from '@/shared/components/scroll'
import { isFunction } from '@/shared/utils'

const TransferCardsOfCardCloud = ({ cards, balance = 0, onSubmit, isLoading, isSubAccount = true }) => {
  const RegisterSchema = Yup.object().shape({
    amount: Yup.string()
      .trim()
      .test('minAmount', 'El monto debe ser mayor a $0.00', function (value) {
        return parseFloat(value?.replace(/,/g, '')) > 0
      })
      .required('El monto es requerido'),
    card: Yup.object().nullable().required('La tarjeta destino es requerido'),
    concept: Yup.string().trim().required('El concepto es requerido')
  })

  const formik = useFormik({
    initialValues: {
      card: null,
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
                  El saldo de {isSubAccount ? 'la subcuenta' : 'tarjeta'} seleccionada es: <b>${balance}</b> y el monto
                  a transferir es : <b>${values.amount === '' ? '0.00' : values.amount}</b>
                </Typography>
              </AlertWithFocus>
            )}

            <Stack spacing={0.5}>
              <Typography variant="caption" fontWeight={'bold'}>
                Tarjeta:
              </Typography>
              <RFSelect
                name={'card'}
                disabled={loading}
                textFieldParams={{
                  placeholder: 'Seleccionar ...',
                  size: 'large',
                  required: true
                }}
                options={cards || []}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={props.key}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                      <Avatar
                        sx={theme => ({
                          width: 25,
                          height: 25,
                          m: 0,
                          color: theme.palette.primary.contrastText,
                          backgroundColor: theme.palette.primary.light
                        })}
                      >
                        <MasterCardLogo sx={{ width: 15 }} />
                      </Avatar>
                      <span>{option.label}</span>
                    </Stack>
                  </Box>
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    size="large"
                    placeholder="Seleccionar ..."
                    required
                    inputProps={{
                      ...params.inputProps
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Avatar
                            sx={theme => ({
                              width: 25,
                              height: 25,
                              m: 0,
                              color: theme.palette.primary.contrastText,
                              backgroundColor: theme.palette.primary.light
                            })}
                          >
                            <MasterCardLogo sx={{ width: 15 }} />
                          </Avatar>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(errors.card)}
                    helperText={errors.card}
                  />
                )}
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

export default TransferCardsOfCardCloud
