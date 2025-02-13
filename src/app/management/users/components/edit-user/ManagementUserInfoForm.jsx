import { EmailTwoTone, PhoneTwoTone } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { InputAdornment, Stack } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ManagementUpdateUserInfoAdapter } from '../../adapters'
import { useUpdateUserInfo } from '../../hooks'

import { FormLabelTypography, FormProvider, RFTextField } from '@/shared/components/form'
import { isFunction } from '@/shared/utils'

const ManagementUserInfoForm = ({ user, onSuccess }) => {
  const { mutate, isLoading } = useUpdateUserInfo()

  const ValidationSchema = Yup.object().shape({
    userName: Yup.string().trim().required('Es necesario el nombre(s)'),
    userLastName: Yup.string().trim().required('Es necesario los apellido(s)'),
    userEmail: Yup.string().trim().email('Ingrese un correo valido').required('Es necesario el correo electrónico'),
    userPhone: Yup.string().trim()
  })

  const formik = useFormik({
    initialValues: {
      userName: user?.firstName || '',
      userLastName: user?.lastName || '',
      userEmail: user?.email || '',
      userPhone: user?.phone || ''
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      const data = ManagementUpdateUserInfoAdapter(values, user)
      mutate(data, {
        onSuccess: () => {
          setSubmitting(false)
          isFunction(onSuccess) && onSuccess()
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
          <FormLabelTypography required fontWeight={'bold'}>
            Nombre (s)
          </FormLabelTypography>

          <RFTextField disabled={loading} name={'userName'} required placeholder={'Nombre del usuario...'} />
        </Stack>
        <Stack spacing={1}>
          <FormLabelTypography required fontWeight={'bold'}>
            Apellido (s)
          </FormLabelTypography>

          <RFTextField name={'userLastName'} required placeholder={'Apellidos del usuario...'} disabled={loading} />
        </Stack>
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
                  <EmailTwoTone />
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
                  <PhoneTwoTone />
                </InputAdornment>
              )
            }}
            disabled={loading}
          />
        </Stack>

        <Stack sx={{ pt: 3 }}>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Guardar
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

export default ManagementUserInfoForm
