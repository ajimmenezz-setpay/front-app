import { useEffect, useRef, useState } from 'react'

import PropTypes from 'prop-types'

import { Add, ArrowForwardIos, Delete, FileDownload, FileUpload } from '@mui/icons-material'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { createAvatar } from '@theme/utils'
import { FieldArray, getIn, useFormik } from 'formik'
import * as Yup from 'yup'

import { useFundingCardsExcel } from '@/app/business/dashboard-master/hooks'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { Avatar } from '@/shared/components/avatar'
import { FormProvider, MaskedInput, RFSelect, RFTextField } from '@/shared/components/form'
import { CircularLoading } from '@/shared/components/loadings'
import { Scrollbar } from '@/shared/components/scroll'

function TransactionForm({ cards, setCurrentBalance, insufficient, isBinCard, onSuccess }) {
  const arrayHelpersRef = useRef(null)

  const crypto = window.crypto || window.msCrypto

  const array = new Uint32Array(1)

  const random = crypto.getRandomValues(array)[0]

  const [cardsToSelect, setCardsToSelect] = useState(cards)

  const selectedCards = useCommerceDetailsCard(state => state?.selectedCards)

  const {
    downloadFundingCardsLayoutExcel,
    uploadFundingCardsLayoutExcel,
    loading: isUploadingFile,
    error: errorUploadFile,
    data,
    cards: catalogWithSelectedCards
  } = useFundingCardsExcel(cards)

  const RegisterSchema = Yup.object().shape({
    transactions: Yup.array().of(
      Yup.object().shape({
        amount: Yup.string()
          .test('maxAmount', 'Monto máximo de transferencia $50,000', function (value) {
            return parseFloat(value?.replace(/,/g, '')) <= 50000
          })
          .required('La cantidad es requerida'),
        card: Yup.object().nullable().required('La tarjeta es requerida')
      })
    )
  })

  const formik = useFormik({
    initialValues: {
      transactions: (selectedCards?.length > 0 &&
        isBinCard &&
        selectedCards?.map(card => ({
          id: random,
          card: { value: card?.value, label: card?.label, ...card },
          amount: ''
        }))) || [
        {
          id: random,
          card: null,
          amount: ''
        }
      ],
      concept: ''
    },
    validateOnChange: false,
    validationSchema: RegisterSchema,
    onSubmit: values => {
      if (insufficient) {
        return setSubmitting(false)
      }
      setSubmitting(false)
      return onSuccess(values)
    }
  })

  const { isSubmitting, setFieldValue, values, setSubmitting, errors, touched } = formik

  const loading = isSubmitting || isUploadingFile

  useEffect(() => {
    if (selectedCards && isBinCard) {
      const filterCards = selectedCards?.map(card => ({ ...card, isDisabled: true }))
      setCardsToSelect(filterCards)
    }
  }, [selectedCards, isBinCard])

  useEffect(() => {
    if (data && data?.length > 0) {
      setFieldValue('transactions', data)
    }
  }, [data, catalogWithSelectedCards])

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
    <>
      <Stack p={3} pb={0} gap={1} flexDirection={{ xs: 'column-reverse', md: 'row' }} alignItems={'center'}>
        <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
          Transacciones:
        </Typography>
        <Stack spacing={2} justifyContent="flex-end" direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }} />
        <Stack direction={'row'} spacing={1}>
          <IconButton
            disabled={isUploadingFile}
            size="small"
            color="success"
            title="Descargar Layout"
            onClick={() => downloadFundingCardsLayoutExcel(cards)}
          >
            <FileDownload />
          </IconButton>
          {isUploadingFile ? (
            <CircularLoading />
          ) : (
            <IconButton
              disabled={isUploadingFile}
              size="small"
              color="info"
              title="Cargar Layout"
              onClick={() => uploadFundingCardsLayoutExcel()}
            >
              <FileUpload />
            </IconButton>
          )}

          {!isBinCard && (
            <Button
              type="button"
              size="small"
              variant={'outlined'}
              startIcon={<Add />}
              disabled={loading}
              onClick={() =>
                arrayHelpersRef.current.push({
                  id: random,
                  card: null,
                  amount: '',
                  concept: ''
                })
              }
              sx={{ flexShrink: 0 }}
            >
              Agregar
            </Button>
          )}
        </Stack>
      </Stack>

      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <FormProvider formik={formik}>
          <Box sx={{ p: 3 }}>
            {errorUploadFile && (
              <Alert severity={errorUploadFile?.severity || 'error'} sx={{ mb: 3 }}>
                <AlertTitle>{errorUploadFile?.severity === 'error' ? 'Error Layout' : 'Advertencia'}</AlertTitle>
                {errorUploadFile?.message}
              </Alert>
            )}

            <FieldArray
              name="transactions"
              render={arrayHelpers => {
                arrayHelpersRef.current = arrayHelpers
                return (
                  <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
                    {values?.transactions.map((item, index) => {
                      const card = `transactions[${index}].card`
                      const errorFieldCard = getIn(errors, card)
                      const amount = `transactions[${index}].amount`

                      return (
                        <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                          <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                            sx={{ width: 1 }}
                            alignItems={'flex-start'}
                          >
                            <Typography variant={'overline'} color={'text.disabled'}>
                              {index + 1}
                            </Typography>
                            <RFSelect
                              name={card}
                              disabled={loading || isBinCard}
                              textFieldParams={{
                                placeholder: 'Seleccionar ...',
                                label: 'Tarjeta',
                                required: true,
                                size: 'small'
                              }}
                              options={cardsToSelect || []}
                              onChange={(e, value) => {
                                const filterCards = cardsToSelect?.map(card => {
                                  if (!value?.value && card.value === item?.card?.value) {
                                    return { ...card, isDisabled: false }
                                  }
                                  if (card.value === value?.value) {
                                    return { ...card, isDisabled: true }
                                  }

                                  if (card.value === item?.card?.value) {
                                    return { ...card, isDisabled: false }
                                  }
                                  return card
                                })

                                setCardsToSelect(filterCards)
                                setFieldValue(card, value)
                              }}
                              renderOption={(props, option) => {
                                const avatar = createAvatar(option?.label)

                                return (
                                  <Box component="li" {...props} key={props.key}>
                                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                      <Avatar
                                        src={option.label !== '' ? option.label : ''}
                                        alt={option.label}
                                        color={avatar?.color}
                                        sx={{ width: 25, height: 25, fontSize: 12 }}
                                      >
                                        {avatar?.name}
                                      </Avatar>
                                      <span>{option.label}</span>
                                    </Stack>
                                  </Box>
                                )
                              }}
                              renderInput={params => {
                                const avatar = createAvatar(params?.inputProps?.value || '')

                                return (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Seleccionar ..."
                                    label={'Tarjeta'}
                                    inputProps={{
                                      ...params.inputProps
                                    }}
                                    error={Boolean(errorFieldCard)}
                                    helperText={errorFieldCard || ''}
                                    required
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <Avatar
                                            src={''}
                                            alt={params.inputProps?.value || 'avatar'}
                                            color={avatar?.color}
                                            sx={{ width: 25, height: 25, fontSize: 12 }}
                                          >
                                            {avatar?.name !== 'undefined' ? avatar?.name : null}
                                          </Avatar>
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                )
                              }}
                              sx={{ width: { xs: 1, lg: 0.6 } }}
                            />
                            <RFTextField
                              sx={{ width: { xs: 1, lg: 0.4 } }}
                              size={'small'}
                              name={amount}
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
                                  value: item.amount,
                                  onAccept: value => {
                                    setFieldValue(amount, value)
                                  }
                                }
                              }}
                            />
                            {index !== 0 && !isBinCard && (
                              <IconButton
                                size="small"
                                color="error"
                                title="Borrar"
                                disabled={loading}
                                onClick={() => {
                                  const filterCards = cardsToSelect?.map((card, cardIndex) => {
                                    if (card.value === item?.card?.value) {
                                      return { ...card, isDisabled: false }
                                    }
                                    return card
                                  })

                                  setCardsToSelect(filterCards)
                                  arrayHelpers.remove(index)
                                }}
                              >
                                <Delete />
                              </IconButton>
                            )}
                          </Stack>
                        </Stack>
                      )
                    })}
                  </Stack>
                )
              }}
            />
            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
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

            <Stack sx={{ pt: 3 }}>
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
          </Box>
        </FormProvider>
      </Scrollbar>
    </>
  )
}

export default TransactionForm

TransactionForm.propTypes = {
  cards: PropTypes.any,
  insufficient: PropTypes.any,
  isBinCard: PropTypes.any,
  onSuccess: PropTypes.func,
  setCurrentBalance: PropTypes.func
}
