import { useState } from 'react'

import { AddCard, CreditCard, VpnKey, WarningAmberOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { InputAdornment, Stack, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { format, isAfter, isValid, parse } from 'date-fns'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { CreateCardAdapter, MANAGEMENT_STOCK_CARDS_KEYS } from '@/app/management/stock-cards/adapters'
import { useCreateNewStockCard } from '@/app/management/stock-cards/hooks'
import { SHARED_CARD_KEYS } from '@/app/shared/adapters'
import { FormProvider, MaskedInput, RFSelect, RFTextField } from '@/shared/components/form'
import { ModalAlert } from '@/shared/components/modals'
import { Scrollbar } from '@/shared/components/scroll'
import { useGetQueryData } from '@/shared/hooks'

export function StockCardForm({ setOpen }) {
  const { registerCard: createCard, isLoading: isCreatingCard } = useCreateNewStockCard()
  const commerces = useGetQueryData([MANAGEMENT_STOCK_CARDS_KEYS.AFFILIATED_COMMERCES_LIST]) || []
  const cardTypes = useGetQueryData([SHARED_CARD_KEYS.CARD_TYPES_LIST]) || []
  const [openAlertConfirm, setOpenAlertConfirm] = useState(false)

  const CardSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .transform((value, originalValue) => originalValue.replace(/\s/g, '')) // Elimina los espacios en blanco
      .min(16, 'Debe contener 16 digitos')
      .required('El número de la tarjeta es requerido'),
    cvv: Yup.string().min(3, 'Debe contener 3 digitos').required('El CVV es requerido'),
    cardType: Yup.object().nullable().required('El tipo de tarjeta es requerido'),
    expiration: Yup.string()
      .required('La fecha de vencimiento es requerida')
      .test('is-future-date', 'La fecha  debe ser mayor que la fecha actual', function (value) {
        const date = parse(`01/${value}`, 'dd/MM/yyyy', new Date())
        const currentDate = new Date()
        const isDateValid = isValid(date)
        return isDateValid && isAfter(date, currentDate)
      })
  })

  const formik = useFormik({
    initialValues: {
      cardNumber: '',
      cardType: (cardTypes && cardTypes.length > 0 && cardTypes[0]) || null,
      expiration: '',
      cvv: '',
      assigned: null
    },
    validationSchema: CardSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false)
      if (values.assigned) {
        setOpenAlertConfirm(true)
      } else {
        handleCreateCard(values)
      }
    }
  })

  const { isSubmitting, values, setFieldValue, errors, handleSubmit, touched, resetForm, setSubmitting } = formik

  const loading = isSubmitting || isCreatingCard

  const handleCreateCard = (card, isAssigned = false) => {
    const cardAdapter = CreateCardAdapter(card)
    createCard(
      { ...cardAdapter, isAssigned },
      {
        onSuccess: () => {
          setOpen(false)
          resetForm()
          setOpenAlertConfirm(false)
        },
        onError: () => {
          setOpenAlertConfirm(false)
        }
      }
    )
  }

  return (
    <>
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <FormProvider formik={formik}>
          <Stack spacing={5} sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Tipo de Tarjeta
                </Typography>

                <RFSelect
                  name={'cardType'}
                  disableClearable
                  textFieldParams={{ placeholder: 'Seleccionar ...', required: true }}
                  options={cardTypes}
                  disabled={loading}
                />
              </Stack>

              <Stack>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Número de Tarjeta
                </Typography>
                <RFTextField
                  autoFocus
                  name={'cardNumber'}
                  required={true}
                  placeholder={'5254 2700 9717 8968'}
                  fullWidth
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
              </Stack>

              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} display={'flex'}>
                <Stack sx={{ width: { xs: '100%', lg: '40%' } }}>
                  <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                    CVV
                  </Typography>
                  <RFTextField
                    name={'cvv'}
                    required={true}
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
                <Stack>
                  <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                    Vence
                  </Typography>
                  <DatePicker
                    disabled={loading}
                    views={['year', 'month']}
                    name={'expiration'}
                    value={new Date(values.expiration) ?? null}
                    onChange={newValue => {
                      const isDateValid = isValid(newValue)
                      if (isDateValid) {
                        return formik.setFieldValue('expiration', format(newValue, 'MM/yyyy'))
                      } else {
                        return formik.setFieldValue('expiration', '')
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(touched.expiration && errors.expiration),
                        required: true,
                        helperText: touched.expiration && errors.expiration ? errors.expiration : ''
                      }
                    }}
                    disablePast={true}
                    format="MM/yy"
                  />
                </Stack>
              </Stack>
              <Stack>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Asignar:
                </Typography>
                <RFSelect
                  name={'assigned'}
                  textFieldParams={{ placeholder: 'Seleccionar ...', required: true }}
                  options={commerces}
                  disabled={loading}
                />
              </Stack>
            </Stack>
          </Stack>
        </FormProvider>
      </Scrollbar>
      <Stack sx={{ px: 3, pt: 3 }}>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<AddCard />}
        >
          Crear
        </LoadingButton>
      </Stack>
      {openAlertConfirm && (
        <ModalAlert
          title="Asignar Tarjeta"
          typeAlert="warning"
          textButtonSuccess="Asignar"
          onClose={() => {
            setOpenAlertConfirm(false)
            setSubmitting(false)
          }}
          open={openAlertConfirm}
          isSubmitting={isCreatingCard}
          description={
            <Stack spacing={2}>
              <Typography>¿Está seguro de asignar esta tarjeta a este comercio?</Typography>
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <WarningAmberOutlined />
                <Typography variant={'caption'}>Verifique que todos los datos esten correctos</Typography>
              </Stack>
            </Stack>
          }
          onSuccess={() => {
            handleCreateCard(values, true)
          }}
          fullWidth
          maxWidth="xs"
        />
      )}
    </>
  )
}
