import { LoadingButton } from '@mui/lab'
import { Button, Stack } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useCreateSupportTicketV2 } from '@/app/support/tickets-V2/hooks'
import { FormLabelTypography, FormProvider, RFTextField } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'
import { isFunction } from '@/shared/utils'

const CardCloudMovementTicketForm = ({ movement, onSuccess, onCancel }) => {
  const { mutate, isLoading } = useCreateSupportTicketV2()

  const RegisterSchema = Yup.object().shape({
    description: Yup.string()
      .trim()
      .min(10, 'La descripción debe tener como mínimo 10 caracteres')
      .required('La descripción es requerida')
  })

  const formik = useFormik({
    initialValues: {
      description: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, { setFieldValue, setSubmitting }) => {
      mutate(
        {
          movement_id: movement?.id,
          description: values?.description
        },
        {
          onSuccess: data => {
            setSubmitting(false)
            isFunction(onSuccess) && onSuccess(data)
          },
          onError: () => {
            setSubmitting(false)
          }
        }
      )
    }
  })

  const { isSubmitting } = formik

  const loading = isSubmitting || isLoading

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <FormProvider formik={formik}>
        <Stack p={3}>
          <Stack spacing={0.5}>
            <FormLabelTypography required={true} label="Nuevo NIP">
              Descripción
            </FormLabelTypography>

            <RFTextField
              fullWidth
              name={'description'}
              multiline
              disabled={loading}
              rows={4}
              placeholder={'Motivo del reporte del movimiento ..'}
            />
          </Stack>
          <Stack gap={3} mt={2}>
            <LoadingButton variant="contained" size="large" type="submit" loading={loading}>
              Enviar
            </LoadingButton>
            <Button disabled={!!loading} size="large" variant="outlined" onClick={onCancel}>
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Scrollbar>
  )
}

export default CardCloudMovementTicketForm
