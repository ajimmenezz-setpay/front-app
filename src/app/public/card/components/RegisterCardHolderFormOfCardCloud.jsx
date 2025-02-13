import { CheckCircle, EmailOutlined, Phone } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, InputAdornment, Stack, Typography } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useFormik } from 'formik'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'

import { RegisterCardHolderOfCardCloudAdapter } from '../adapters'
import { useAssignCardToCardHolder } from '../hooks'

import { PATH_AUTH } from '@/routes'
import { FormLabelTypography, FormProvider, RFTextField } from '@/shared/components/form'

const RegisterCardHolderFormOfCardCloud = ({ cardData, handleReset }) => {
  const { mutate, isLoading, isSuccess, reset } = useAssignCardToCardHolder()

  const ValidationSchema = Yup.object().shape({
    userName: Yup.string().trim().required('Es necesario el nombre(s)'),
    userLastName: Yup.string().trim().required('Es necesario los apellido(s)'),
    userEmail: Yup.string().trim().email('Ingrese un correo valido').required('Es necesario el correo electrónico'),
    userPhone: Yup.string().trim()
  })

  const formik = useFormik({
    initialValues: {
      userName: '',
      userLastName: '',
      userEmail: '',
      userPhone: ''
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const data = RegisterCardHolderOfCardCloudAdapter(values, cardData)
      mutate(data, {
        onSuccess: () => {
          setSubmitting(false)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { isSubmitting, values } = formik

  const loading = isSubmitting || isLoading

  const tempSuccess = false

  if ((isSuccess && !loading) || tempSuccess) {
    return (
      <motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Stack height={1} gap={3}>
          <Stack flexDirection="column" alignItems={'center'} spacing={2}>
            <CheckCircle sx={{ width: 50, height: 50 }} color={'success'} />
            <Stack alignItems={'center'} spacing={1}>
              <Typography variant="h6">{`Operación Exitosa`}</Typography>
              <Typography variant="caption" color={'text.disabled'}>
                {format(new Date(), 'dd MMM yyyy hh:mm a', { locale: es })}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="column" width={1} spacing={1}>
            <Typography variant="h4" color="textPrimary" align="center">
              Tu cuenta ha sido creada correctamente
            </Typography>
            <Typography variant="h4" color="textPrimary" align="center">
              ¡Bienvenido!
            </Typography>
            <Typography paragraph align="center" variant="body1" color={'text.secondary'} whiteSpace="pre-line">
              Enviamos un correo electrónico a {values?.userEmail || '-'} con los datos de acceso de tu cuenta.
            </Typography>
          </Stack>
          <Stack px={5}>
            <Button
              size={'large'}
              component={RouterLink}
              to={PATH_AUTH.login}
              onClick={() => {
                reset()
                handleReset()
              }}
              variant={'contained'}
              color={'primary'}
            >
              Acceder
            </Button>
          </Stack>
        </Stack>
      </motion.div>
    )
  }

  return (
    <motion.div exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <FormProvider formik={formik}>
        <Stack gap={3}>
          <Stack spacing={1}>
            <FormLabelTypography required fontWeight={'bold'}>
              Nombre (s)
            </FormLabelTypography>

            <RFTextField name={'userName'} required placeholder={'Nombre del usuario...'} disabled={loading} />
          </Stack>

          <Stack spacing={1}>
            <FormLabelTypography required fontWeight={'bold'}>
              Apellido (s)
            </FormLabelTypography>

            <RFTextField name={'userLastName'} required placeholder={'Apellidos del usuario...'} disabled={loading} />
          </Stack>

          <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            <Stack spacing={1} flex={1}>
              <FormLabelTypography required fontWeight={'bold'} noWrap>
                Correo Electrónico
              </FormLabelTypography>
              <RFTextField
                name={'userEmail'}
                required
                placeholder={'usuario@gmail.com...'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined />
                    </InputAdornment>
                  )
                }}
                disabled={loading}
              />
            </Stack>

            <Stack spacing={1} flex={1}>
              <FormLabelTypography fontWeight={'bold'} noWrap>
                Teléfono
              </FormLabelTypography>

              <RFTextField
                name={'userPhone'}
                type={'tel'}
                placeholder={'55 5555 5555'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  )
                }}
                disabled={loading}
              />
            </Stack>
          </Stack>
          <Stack mt={2}>
            <LoadingButton
              loading={loading}
              variant="contained"
              size="large"
              color="primary"
              fullWidth
              type="submit"
              disabled={loading}
            >
              Crear Usuario
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </motion.div>
  )
}

export default RegisterCardHolderFormOfCardCloud
