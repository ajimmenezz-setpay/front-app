import { memo, useState } from 'react'

import { Send } from '@mui/icons-material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { LoadingButton } from '@mui/lab'
import { Collapse, IconButton, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'

import { RightPanel } from '@/app/shared/components'
import { FormProvider, RFSelect, RFTextField, RFUploadMultiFile } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'

function TransactionReport({ open, setOpen, selectedMovement }) {
  const isIncome = selectedMovement?.type === 'ingreso'
  const [openEvidences, setOpenEvidences] = useState(false)

  const handleClose = () => {
    setOpen(false)
    setOpenEvidences(false)
  }

  const formik = useFormik({
    initialValues: {
      description: '',
      category: null,
      files: []
    },
    onSubmit: values => {}
  })

  const { errors, touched, isSubmitting, setFieldValue, values, setSubmitting } = formik

  return (
    <RightPanel open={open} handleClose={handleClose} title={'Incidencia'}>
      <Stack flexDirection="column" alignItems={'center'} justifyContent={'space-between'} spacing={0} p={5}>
        <Typography variant="subtitle1">Movimiento </Typography>
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <Typography variant="h3" color={isIncome ? 'success.main' : 'error'}>
            {`${isIncome ? `+ ${selectedMovement?.amountFormat}` : `- ${selectedMovement?.amountFormat}`}`}
          </Typography>
          <Typography variant="caption" color={isIncome ? 'success.main' : 'error'}>
            MXN
          </Typography>
        </Stack>
        <Typography variant="caption" color={'text.disabled'}>
          {selectedMovement?.fullDate}{' '}
        </Typography>
      </Stack>
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <FormProvider formik={formik}>
          <Stack spacing={2} sx={{ p: 3 }}>
            <Stack>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Categoria:
              </Typography>
              <RFSelect
                name={'category'}
                textFieldParams={{ placeholder: 'Seleccionar ...', required: true }}
                options={[
                  { label: 'Fraude', value: '1' },
                  { label: 'Contracargo', value: '2' }
                ]}
              />
            </Stack>

            <Stack>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Descripcion:
              </Typography>

              <RFTextField
                name={'description'}
                required
                multiline
                rows={2}
                placeholder={'Motivo del cargo desconocido ..'}
              />
            </Stack>

            <Stack spacing={3}>
              <Stack
                flexDirection={'row'}
                alignItems="center"
                width={1}
                sx={{ cursor: 'pointer' }}
                onClick={() => setOpenEvidences(prevState => !openEvidences)}
              >
                <Typography variant="overline" sx={{ color: 'text.disabled', width: 1 }}>
                  Evidencias:
                </Typography>

                <IconButton onClick={() => setOpenEvidences(prevState => !openEvidences)}>
                  {openEvidences ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Stack>

              <Collapse in={openEvidences} timeout="auto">
                <RFUploadMultiFile
                  name={'files'}
                  maxSize={3145728}
                  accept={{
                    'image/*': ['.jpeg', '.png'],
                    'application/pdf': ['.pdf']
                  }}
                />
              </Collapse>
            </Stack>

            <Stack sx={{ pt: 3 }}>
              <LoadingButton variant="contained" color="primary" fullWidth type="submit" startIcon={<Send />}>
                Enviar
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Scrollbar>
    </RightPanel>
  )
}

export default memo(TransactionReport)
