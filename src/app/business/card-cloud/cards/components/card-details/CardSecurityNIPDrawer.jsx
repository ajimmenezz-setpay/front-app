import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { MuiOtpInput } from 'mui-one-time-password-input'
import * as Yup from 'yup'

import { useChangeCardNIP } from '../../hooks'
import { useCardsOfCardCloudStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { FormLabelTypography, FormProvider } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'
import { useConfirm } from '@/shared/hooks'
import { matchIsNumeric } from '@/shared/utils'

const CardSecurityNIPDrawer = () => {
  const selectedCard = useCardsOfCardCloudStore(state => state.selectedCard)
  const open = useCardsOfCardCloudStore(state => state.openChangeNIP)
  const setOpenChangeNIP = useCardsOfCardCloudStore(state => state.setOpenChangeNIP)

  const { mutate, isLoading } = useChangeCardNIP()
  const [ConfirmDialog, confirm] = useConfirm(
    '¿Desea Cambiar su NIP?',
    <Box>
      <Typography>
        Este proceso es irreversible y tendrá que completar el cambio haciendo una consulta de saldo en ATM
      </Typography>
    </Box>
  )

  const RegisterSchema = Yup.object().shape({
    actualNIP: Yup.string()
      .required('El NIP actual es requerido')
      .matches(/^\d{4}$/, 'El NIP actual debe tener exactamente 4 dígitos'),
    newNIP: Yup.string()
      .required('El nuevo NIP es obligatorio')
      .matches(/^\d{4}$/, 'El nuevo NIP debe tener exactamente 4 dígitos'),
    confirmNIP: Yup.string()
      .required('La confirmación del NIP es requerida')
      .oneOf([Yup.ref('newNIP')], 'La confirmación del NIP debe coincidir con el nuevo NIP')
  })

  const formik = useFormik({
    initialValues: {
      actualNIP: '',
      newNIP: '',
      confirmNIP: ''
    },
    validationSchema: RegisterSchema,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: async (values, { setFieldValue, setSubmitting, resetForm }) => {
      setSubmitting(false)
      const ok = await confirm()
      if (!ok) {
        return
      }
      setSubmitting(true)
      mutate(
        { id: selectedCard?.id, old_nip: values?.actualNIP?.toString(), new_nip: values?.newNIP?.toString() },
        {
          onSuccess: () => {
            setSubmitting(false)
            handleClose()
          },
          onError: () => {
            setSubmitting(false)
          }
        }
      )
    }
  })

  const { setFieldValue, values, errors, isSubmitting, resetForm } = formik

  const loading = isLoading || isSubmitting

  const validateChar = value => matchIsNumeric(value)

  const handleClose = () => {
    setOpenChangeNIP(false)
    resetForm()
  }

  return (
    <>
      <ConfirmDialog />
      <RightPanel
        open={Boolean(open)}
        handleClose={handleClose}
        titleElement={<Typography variant="h6">Cambiar NIP Tarjeta</Typography>}
      >
        <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
          {open && (
            <FormProvider formik={formik}>
              <Stack sx={{ p: 3 }} gap={3}>
                <Stack spacing={0.5}>
                  <FormLabelTypography required={true} label="NIP Actual">
                    NIP Actual:
                  </FormLabelTypography>
                  <div>
                    <MuiOtpInput
                      length={4}
                      value={values.actualNIP}
                      onChange={value => {
                        setFieldValue('actualNIP', value)
                      }}
                      validateChar={validateChar}
                      sx={{ gap: { xs: 1.5, sm: 2, md: 3 } }}
                      TextFieldsProps={{
                        placeholder: '-',
                        disabled: loading,
                        error: !!errors.actualNIP,
                        type: 'number'
                      }}
                    />
                    {errors.actualNIP && (
                      <Box color={'error.main'} sx={{ typography: 'caption' }} component="span">
                        {errors.actualNIP}
                      </Box>
                    )}
                  </div>
                </Stack>

                <Stack spacing={0.5}>
                  <FormLabelTypography required={true} label="Nuevo NIP">
                    Nuevo NIP:
                  </FormLabelTypography>
                  <div>
                    <MuiOtpInput
                      length={4}
                      value={values.newNIP}
                      onChange={value => {
                        setFieldValue('newNIP', value)
                      }}
                      validateChar={validateChar}
                      sx={{ gap: { xs: 1.5, sm: 2, md: 3 } }}
                      TextFieldsProps={{ placeholder: '-', disabled: loading, error: !!errors.newNIP, type: 'number' }}
                    />
                    {errors.newNIP && (
                      <Box color={'error.main'} sx={{ typography: 'caption' }} component="span">
                        {errors.newNIP}
                      </Box>
                    )}
                  </div>
                </Stack>

                <Stack spacing={0.5}>
                  <FormLabelTypography required={true} label="Confirmar Nuevo NIP">
                    Confirmar NIP:
                  </FormLabelTypography>
                  <div>
                    <MuiOtpInput
                      length={4}
                      value={values.confirmNIP}
                      onChange={value => {
                        setFieldValue('confirmNIP', value)
                      }}
                      validateChar={validateChar}
                      sx={{ gap: { xs: 1.5, sm: 2, md: 3 } }}
                      TextFieldsProps={{
                        placeholder: '-',
                        disabled: loading,
                        error: !!errors.confirmNIP,
                        type: 'number'
                      }}
                    />
                    {errors.confirmNIP && (
                      <Box color={'error.main'} sx={{ typography: 'caption' }} component="span">
                        {errors.confirmNIP}
                      </Box>
                    )}
                  </div>
                </Stack>

                <Stack gap={3} mt={2}>
                  <LoadingButton variant="contained" size="large" type="submit" loading={loading}>
                    Actualizar NIP
                  </LoadingButton>
                  <Button disabled={!!loading} size="large" variant="outlined" onClick={handleClose}>
                    Cancelar
                  </Button>
                </Stack>
              </Stack>
            </FormProvider>
          )}
        </Scrollbar>
      </RightPanel>
    </>
  )
}

export default CardSecurityNIPDrawer
