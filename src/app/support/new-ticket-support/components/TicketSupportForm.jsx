import PropTypes from 'prop-types'

import { LoadingButton } from '@mui/lab'
import { Box, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { motion } from 'framer-motion'
import * as Yup from 'yup'

import { TicketCauseLabel } from './TicketCauseLabel'

import { NewTicketSupportAdapter } from '../adapters'
import { useCreateNewTicketSupport } from '../hooks'

import { FormProvider, RFTextField, RFUploadSingleFile } from '@/shared/components/form'

const TicketSupportForm = ({ causes = [], onSuccess }) => {
  const { mutate, isLoading } = useCreateNewTicketSupport()

  const ValidationSchema = Yup.object().shape({
    cause: Yup.object().nullable().required('La causa es necesaria'),
    description: Yup.string()
      .trim()
      .max(200, 'Máximo 200 caracteres')
      .required('La descripción del ticket es necesaria')
  })

  const formik = useFormik({
    initialValues: {
      cause: null,
      description: '',
      file: null
    },
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting, setFieldValue }) => {
      const ticket = NewTicketSupportAdapter(values)
      mutate(ticket, {
        onSuccess: () => {
          setSubmitting(false)
          onSuccess()
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { values, setFieldValue, setTouched, isSubmitting, errors } = formik

  const loading = isSubmitting || isLoading

  const handleChangeCause = cause => {
    setFieldValue('cause', cause)
  }

  return (
    <FormProvider formik={formik}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Seleccione una Causa
          </Typography>
          <Stack flexDirection={'row'} flexWrap={'wrap'} gap={1}>
            {causes?.map(cause => {
              const selected = values.cause?.id === cause?.id
              return (
                <TicketCauseLabel
                  key={cause?.id}
                  variant={selected ? 'ghost' : 'filled'}
                  color={cause?.color}
                  sx={{
                    textTransform: 'uppercase',
                    marginRight: 1,
                    marginBottom: 2,
                    cursor: 'pointer',
                    ...(!cause?.color && {
                      border: '2px dashed', // Ajusta el estilo y grosor según tus necesidades
                      borderColor: theme => theme.palette.text.disabled
                    }),
                    ...(selected && {
                      border: '3px solid', // Ajusta el estilo y grosor según tus necesidades
                      borderColor: theme => theme.palette.primary.main
                    })
                  }}
                >
                  <motion.div
                    key={cause?.id}
                    onClick={() => handleChangeCause(cause)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    {cause?.cause}
                  </motion.div>
                </TicketCauseLabel>
              )
            })}
          </Stack>
          <Stack spacing={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Causa:{' '}
              <Box component={'span'} color={'error.main'}>
                *
              </Box>
            </Typography>

            <Typography fontWeight={'bold'} color={errors.cause ? 'error.main' : 'text.primary'} variant="subtitle1">
              {values.cause?.cause || errors.cause}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Descripción{' '}
            <Box component={'span'} color={'error.main'}>
              *
            </Box>
          </Typography>

          <RFTextField
            size={'small'}
            name={'description'}
            multiline
            rows={4}
            disabled={loading}
            inputProps={{ maxLength: '200' }}
            placeholder={'Descripción del ticket...'}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="overline" sx={{ color: 'text.disabled', width: 1 }}>
            Archivo (Max - 3MB):
          </Typography>
          <RFUploadSingleFile
            name={'file'}
            maxSize={3145728}
            accept={{
              'image/*': ['.jpeg', '.jpg', '.png'],
              'application/pdf': ['.pdf']
            }}
          />
        </Stack>

        <Stack sx={{ pt: 1 }}>
          <LoadingButton loading={loading} variant="contained" size="large" color="primary" fullWidth type="submit">
            Generar Ticket
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

TicketSupportForm.propTypes = {
  causes: PropTypes.array,
  onSuccess: PropTypes.func
}

export default TicketSupportForm
