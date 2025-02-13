import { useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { stringToColor } from '@theme/utils'
import { useFormik } from 'formik'
import { MuiChipsInput } from 'mui-chips-input'
import * as Yup from 'yup'

import { SharedChargeKeysCardsAdapter } from '@/app/business/viabo-card/cards/adapters'
import { useSharedChargeKeys } from '@/app/business/viabo-card/cards/hooks'
import { FormProvider } from '@/shared/components/form'
import { Modal } from '@/shared/components/modals'

export function ModalSharedCharge({ open, onClose, card }) {
  const { mutate: shared, isLoading } = useSharedChargeKeys()
  const [chipInputValue, setChipInputValue] = useState('')

  const SharedSchema = Yup.object().shape({
    emails: Yup.array()
      .of(Yup.string().email('Deben ser direcciones de correo válidos'))
      .min(1, 'Las correos son requeridos')
  })

  const formik = useFormik({
    initialValues: {
      emails: []
    },
    validationSchema: SharedSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const data = SharedChargeKeysCardsAdapter(card, values)
      shared(data, {
        onSuccess: () => {
          setSubmitting(false)
          onClose()
          resetForm()
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { isSubmitting, handleSubmit, values, touched, errors, setFieldValue, resetForm } = formik
  const loading = isSubmitting || isLoading

  const handleChipInputChange = value => {
    if (value.trim().length > 0 && value.includes(' ')) {
      const emailArray = value.trim().split(/[, ]+/)
      setFieldValue('emails', [...values.emails, ...emailArray])
      setChipInputValue('')
    } else {
      setChipInputValue(value)
    }
  }

  const handleBlur = event => {
    const value = event.target.value?.trim()
    if (value.length > 0) {
      setFieldValue('emails', [...values.emails, value])
      setChipInputValue('')
    }
  }

  return (
    <Modal
      onClose={() => {
        onClose()
        resetForm()
      }}
      onSuccess={handleSubmit}
      isSubmitting={loading}
      fullWidth
      maxWidth="sm"
      scrollType="body"
      title={'Compartir'}
      textButtonSuccess="Enviar"
      open={open}
    >
      <FormProvider formik={formik}>
        <Stack spacing={3} sx={{ py: 3 }}>
          <Stack>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Correos Electronicos:
            </Typography>
            <MuiChipsInput
              disableEdition
              name={'emails'}
              fullWidth
              disabled={loading}
              placeholder="Escribe los correos para compartir"
              value={values?.emails || []}
              helperText={touched.emails && errors.emails ? errors.emails : ''}
              error={Boolean(touched.emails && errors.emails)}
              onChange={value => {
                setFieldValue('emails', value)
              }}
              renderChip={(Component, key, props) => (
                <Component
                  {...props}
                  variant={'filled'}
                  sx={{
                    fontWeight: 'bolder',
                    backgroundColor: stringToColor(props?.label || ''),
                    color: 'white',
                    '& .MuiChip-deleteIcon': { color: 'white' }
                  }}
                  key={key}
                />
              )}
              onBlur={handleBlur}
              onInputChange={handleChipInputChange}
              inputValue={chipInputValue}
            />
          </Stack>
        </Stack>
      </FormProvider>
    </Modal>
  )
}
