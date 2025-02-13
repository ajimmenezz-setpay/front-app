import { useMemo, useState } from 'react'

import { WarningAmberOutlined } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { MANAGEMENT_STOCK_CARDS_KEYS } from '@/app/management/stock-cards/adapters'
import { AssignCardsAdapter } from '@/app/management/stock-cards/adapters/assignCardsAdapter'
import { useAssignCards } from '@/app/management/stock-cards/hooks/useAssignCards'
import { useAssignCardStore } from '@/app/management/stock-cards/store'
import { SHARED_CARD_KEYS } from '@/app/shared/adapters'
import { CardNumber } from '@/app/shared/components/card'
import { FormProvider, RFSelect, RFTextField } from '@/shared/components/form'
import { Modal, ModalAlert } from '@/shared/components/modals'
import { useGetQueryData } from '@/shared/hooks'

export default function AssignCardModal() {
  const setOpenAssignCards = useAssignCardStore(state => state.setOpen)
  const setCard = useAssignCardStore(state => state.setCard)
  const card = useAssignCardStore(state => state.card)
  const commerces = useGetQueryData([MANAGEMENT_STOCK_CARDS_KEYS.AFFILIATED_COMMERCES_LIST]) || []
  const cardsList = useGetQueryData([MANAGEMENT_STOCK_CARDS_KEYS.STOCK_CARDS_LIST]) || []
  const cardTypes = useGetQueryData([SHARED_CARD_KEYS.CARD_TYPES_LIST]) || []
  const [openAlertConfirm, setOpenAlertConfirm] = useState(false)

  const { mutate: assign, isLoading: isAssigning } = useAssignCards()

  const schema = useMemo(() => {
    const initialSchema = {
      commerce: Yup.object().nullable().required('El comercio es requerido')
    }
    if (card) {
      return {
        ...initialSchema
      }
    }
    return {
      ...initialSchema,
      cardType: Yup.object().nullable().required('El tipo de tarjeta es requerido'),
      numberOfCards: Yup.number()
        .min(1, 'Al menos debe existir una tarjeta')
        .test('maxCards', 'El maximo de tarjetas', function (value) {
          const { cardType } = this.parent
          const filteredCards = cardsList.filter(card => card.cardTypeId === cardType.id)
          const count = filteredCards.length
          if (value > count) {
            return this.createError({
              message: `No se pueden agregar más tarjetas que las disponibles (${count} tarjetas)`
            })
          }
          return true
        })
        .required('El número de tarjetas es requerido')
    }
  }, [card, cardsList])

  const initial = useMemo(() => {
    if (card) {
      return {
        cardId: card?.id,
        commerce: null
      }
    }
    return {
      numberOfCards: 1,
      cardType: (cardTypes && cardTypes.length > 0 && cardTypes[0]) || null,
      commerce: null
    }
  }, [card])

  const formik = useFormik({
    initialValues: initial,
    validationSchema: Yup.object().shape(schema),
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(false)
      setOpenAlertConfirm(true)
    }
  })

  const { isSubmitting, handleSubmit, values, setSubmitting } = formik

  const isLoading = isSubmitting || isAssigning

  const handleAssignCards = cards => {
    const assignData = AssignCardsAdapter(cards)
    assign(assignData, {
      onSuccess: () => {
        setOpenAssignCards(false)
        setCard(null)
        setOpenAlertConfirm(false)
      },
      onError: () => {
        setOpenAlertConfirm(false)
      }
    })
  }
  return (
    <>
      <Modal
        onClose={() => {
          setOpenAssignCards(false)
          setCard(null)
        }}
        onSuccess={handleSubmit}
        isSubmitting={isLoading}
        fullWidth
        scrollType="body"
        title={!card ? 'Asignar Tarjetas' : 'Asignar Tarjeta'}
        textButtonSuccess="Asignar"
        open={!openAlertConfirm}
      >
        <FormProvider formik={formik}>
          <Stack spacing={3} sx={{ py: 3 }}>
            {!card ? (
              <>
                <Stack>
                  <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                    Tipo de Tarjeta:
                  </Typography>
                  <RFSelect
                    name={'cardType'}
                    textFieldParams={{ placeholder: 'Seleccionar ...', required: true }}
                    options={cardTypes}
                    disabled={isLoading}
                  />
                </Stack>
                <Stack>
                  <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                    Número de tarjetas:
                  </Typography>
                  <RFTextField
                    name={'numberOfCards'}
                    placeholder={'1'}
                    type={'number'}
                    InputLabelProps={{
                      shrink: true
                    }}
                    inputProps={{ inputMode: 'numeric', min: '1' }}
                    disabled={isLoading}
                  />
                </Stack>
              </>
            ) : (
              <CardNumber card={card} />
            )}
            <Stack>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Comercio:
              </Typography>
              <RFSelect
                name={'commerce'}
                textFieldParams={{ placeholder: 'Seleccionar ...', required: true }}
                options={commerces}
                disabled={isLoading}
              />
            </Stack>
          </Stack>
        </FormProvider>
      </Modal>
      {openAlertConfirm && (
        <ModalAlert
          title={!card ? 'Asignar Tarjetas' : 'Asignar Tarjeta'}
          typeAlert="warning"
          textButtonSuccess="Asignar"
          onClose={() => {
            setOpenAlertConfirm(false)
            setSubmitting(false)
          }}
          open={openAlertConfirm}
          isSubmitting={isLoading}
          description={
            <Stack spacing={2}>
              <Typography>
                {!card
                  ? '¿Está seguro de asignar estas tarjetas a este comercio?'
                  : '¿Está seguro de asignar esta tarjeta a este comercio?'}
              </Typography>
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <WarningAmberOutlined />
                <Typography variant={'caption'}>Verifique que todos los datos esten correctos</Typography>
              </Stack>
            </Stack>
          }
          onSuccess={() => {
            handleAssignCards(values)
          }}
          fullWidth
          maxWidth="xs"
        />
      )}
    </>
  )
}
