import PropTypes from 'prop-types'

import { LoadingButton } from '@mui/lab'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import ExpensesResume from './ExpensesResume'

import { VerifyExpensesAdapter } from '../../../adapters'
import { useVerifyExpensesMovements } from '../../../hooks'

import { FormProvider, RFTextField, RFUploadMultiFile, RFUploadSingleFile } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'

const VerifyExpensesForm = ({ movements = [], onSuccess }) => {
  const { mutate, isLoading } = useVerifyExpensesMovements()

  const ValidationSchema = Yup.object().shape({
    note: Yup.string().when(['method', 'singleFile'], {
      is: (method, singleFile) => method !== 'invoice' && !singleFile,
      then: schema => schema.trim().required('La nota es requerida cuando no existe un archivo.'),
      otherwise: schema => Yup.string()
    }),
    method: Yup.string(),
    files: Yup.array().when('method', {
      is: 'invoice',
      then: schema =>
        schema
          .max(2, 'Cargar máximo 2 archivos por factura.')
          .test('fileFormat', 'Se requiere el archivo PDF y XML de la factura.', function (files) {
            const pdfCount = files.filter(file => file.type === 'application/pdf').length
            const xmlCount = files.filter(file => ['text/xml', 'application/xml'].includes(file.type)).length
            return pdfCount === 1 && xmlCount === 1
          }),
      otherwise: schema => Yup.array()
    }),
    singleFile: Yup.mixed().when('method', {
      is: method => method !== 'invoice',
      then: schema =>
        schema.when(['method', 'note'], {
          is: (method, note) => method !== 'invoice' && !note,
          then: schema => schema.required('El archivo es requerido cuando no hay una nota.'),
          otherwise: schema => Yup.mixed().nullable()
        }),
      otherwise: schema => Yup.mixed().nullable()
    })
  })

  const formik = useFormik({
    initialValues: {
      note: '',
      method: 'invoice',
      files: [],
      singleFile: null
    },
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting, setFieldValue }) => {
      const data = VerifyExpensesAdapter(values, movements)
      mutate(data, {
        onSuccess: () => {
          onSuccess()
          setSubmitting(false)
        },
        onError: () => {
          setFieldValue('files', [])
          setFieldValue('singleFile', null)
          setSubmitting(false)
        }
      })
    }
  })

  const { values, setFieldValue, setTouched, isSubmitting } = formik

  const isInvoice = values.method === 'invoice'

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <ExpensesResume movements={movements} />
      <FormProvider formik={formik}>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack>
            <FormControl disabled={isLoading}>
              <FormLabel id="demo-row-radio-buttons-group-label"> Seleccione el método de comprobación:</FormLabel>
              <RadioGroup
                value={values.method}
                onChange={e => {
                  setFieldValue('method', e.target.value)
                  setFieldValue('files', [])
                  setFieldValue('singleFile', null)
                  setTouched({}, false)
                }}
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="invoice" control={<Radio />} label="Factura (XML y PDF)" />
                <FormControlLabel value="image" control={<Radio />} label="Nota o archivo (Imagen o PDF)" />
              </RadioGroup>
            </FormControl>
          </Stack>

          {!isInvoice && (
            <Stack spacing={1}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Nota:
              </Typography>

              <RFTextField name={'note'} multiline rows={1} placeholder={'Motivo de la comprobación...'} />
            </Stack>
          )}

          <Stack spacing={1}>
            <Typography variant="overline" sx={{ color: 'text.disabled', width: 1 }}>
              Archivos (Max - 3MB):
            </Typography>
            {isInvoice ? (
              <RFUploadMultiFile
                name={'files'}
                maxSize={3145728}
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/xml': ['.xml'],
                  'text/xml': ['.xml']
                }}
                {...(isInvoice ? { maxFiles: 2 } : {})}
              />
            ) : (
              <RFUploadSingleFile
                name={'singleFile'}
                maxSize={3145728}
                accept={{
                  'image/*': ['.jpeg', '.jpg', '.png'],
                  'application/pdf': ['.pdf']
                }}
              />
            )}
          </Stack>

          <Stack sx={{ pt: 1 }}>
            <LoadingButton
              loading={isLoading || isSubmitting}
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
            >
              Comprobar
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Scrollbar>
  )
}

VerifyExpensesForm.propTypes = {
  movements: PropTypes.array,
  onSuccess: PropTypes.func
}

export default VerifyExpensesForm
