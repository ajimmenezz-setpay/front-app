import { LoadingButton } from '@mui/lab'
import { Box, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { CardCloudAssignStockCardsAdapter } from '../adapters'
import { useAssignCardsByCompanyOfCardCloud } from '../hooks'

import { FormProvider, RFSelect, RFTextField } from '@/shared/components/form'

const CARD_TYPES = [
  { label: 'Virtual', value: 'virtual' },
  { label: 'Física', value: 'physical' }
]

const CardCloudAssignCardsForm = ({ companies, onSuccess }) => {
  const { mutate, isLoading } = useAssignCardsByCompanyOfCardCloud()

  const ValidationSchema = Yup.object().shape({
    company: Yup.object().nullable().required('Es necesario la empresa'),
    type: Yup.object().nullable().required('Es necesario el tipo de tarjeta'),
    amount: Yup.number().min(1, 'Al menos debe existir una tarjeta').required('Es necesario el número de tarjetas')
  })

  const formik = useFormik({
    initialValues: {
      company: null,
      type: CARD_TYPES[0] || null,
      amount: 1
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting, setFieldValue }) => {
      const data = CardCloudAssignStockCardsAdapter(values)
      mutate(data, {
        onSuccess: () => {
          onSuccess()
          setSubmitting(false)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { isSubmitting } = formik

  const loading = isSubmitting || isLoading

  return (
    <FormProvider formik={formik}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Empresa
            <Box component={'span'} color={'error.main'} ml={0.5}>
              *
            </Box>
          </Typography>

          <RFSelect
            textFieldParams={{ required: true, placeholder: 'Seleccionar Empresa' }}
            required
            name={'company'}
            disabled={loading}
            options={companies || []}
          />
        </Stack>
        <Stack>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Tipo de Tarjeta
            <Box component={'span'} color={'error.main'} ml={0.5}>
              *
            </Box>
          </Typography>

          <RFSelect
            disableClearable
            textFieldParams={{ required: true, placeholder: 'Seleccionar Tipo de Tarjeta' }}
            required
            name={'type'}
            disabled={loading}
            options={CARD_TYPES}
          />
        </Stack>

        <Stack spacing={1} flex={1}>
          <Typography type={'email'} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Número de tarjetas
            <Box component={'span'} color={'error.main'} ml={0.5}>
              *
            </Box>
          </Typography>

          <RFTextField
            name={'amount'}
            required
            placeholder={'1'}
            type={'number'}
            inputProps={{ inputMode: 'numeric', min: '1' }}
            disabled={loading}
          />
        </Stack>

        <Stack sx={{ pt: 1 }}>
          <LoadingButton size={'large'} loading={loading} variant="contained" color="primary" fullWidth type="submit">
            Asignar
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

export default CardCloudAssignCardsForm
