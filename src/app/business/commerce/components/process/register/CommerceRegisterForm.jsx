import { useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { EmailOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  AlertTitle,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import { MuiTelInput } from 'mui-tel-input'
import { Link as RouterLink } from 'react-router-dom'

import { NewCommerceAdapter } from '@/app/business/commerce/adapters'
import { useRegisterCommerce } from '@/app/business/commerce/hooks'
import { PROCESS_LIST } from '@/app/business/commerce/services'
import { propTypesStore } from '@/app/business/commerce/store'
import { commerceRegisterValidation } from '@/app/business/commerce/validations'
import { PUBLIC_PATHS } from '@/routes'
import { AlertWithFocus } from '@/shared/components/alerts'

CommerceRegisterForm.propTypes = {
  store: PropTypes.shape(propTypesStore)
}

function CommerceRegisterForm({ store }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { schema, initialValues } = useMemo(() => commerceRegisterValidation(store), [store])
  const { setActualProcess, setLastProcess } = store

  const {
    mutate: registerCommerce,
    isError: isErrorRegisterCommerce,
    isLoading: isCreatingCommerce,
    error
  } = useRegisterCommerce()

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: values => {
      const commerceAdapter = NewCommerceAdapter(values)
      const { email } = commerceAdapter
      registerCommerce(commerceAdapter, {
        onSuccess: () => {
          setActualProcess(PROCESS_LIST.VALIDATION_CODE)
          setLastProcess({ info: { email }, name: PROCESS_LIST.REGISTER })
          setSubmitting(false)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const {
    handleSubmit,
    values,
    errors,
    touched,
    handleChange,
    isSubmitting,
    setSubmitting,
    getFieldProps,
    setFieldValue
  } = formik

  const loading = isCreatingCommerce || isSubmitting

  const handleContinueProcess = () => {
    setActualProcess(PROCESS_LIST.CONTINUE_PROCESS)
  }

  return (
    <>
      <Stack direction="column" width={1} spacing={1}>
        <Typography variant="h4" color="textPrimary" align="center">
          Registrar Comercio
        </Typography>
        <Typography paragraph align="center" variant="body1" color={'text.secondary'} whiteSpace="pre-line">
          Ingrese la información para iniciar con el proceso de registro.
        </Typography>
      </Stack>

      {isErrorRegisterCommerce && (
        <AlertWithFocus listenElement={isErrorRegisterCommerce} sx={{ mt: 3, textAlign: 'initial' }} severity="warning">
          <AlertTitle sx={{ textAlign: 'initial' }}>Error al registrar el comercio</AlertTitle>
          {error}
        </AlertWithFocus>
      )}

      <Box width={1} mt={4} component={'form'} onSubmit={handleSubmit}>
        {/* <RegisterWithGoogle /> */}
        <Stack spacing={3} pb={5} direction="column">
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <TextField
              fullWidth
              name="name"
              label="Nombre(s)"
              autoComplete="on"
              autoFocus
              value={values.name}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              fullWidth
              name="lastName"
              label="Apellidos"
              value={values.lastName}
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Correo"
              placeholder={'usuario@dominio.com'}
              value={values.email}
              onChange={handleChange}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                )
              }}
            />

            <MuiTelInput
              name="phone"
              fullWidth
              langOfCountryName="es"
              preferredCountries={['MX', 'US']}
              continents={['NA', 'SA']}
              value={values.phone || '+52'}
              disabled={loading}
              onChange={(value, info) => {
                setFieldValue('phone', value)
              }}
              error={touched.phone && Boolean(errors.phone)}
              helperText={touched.phone && errors.phone}
            />
          </Stack>

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Contraseña"
            placeholder={'********'}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 1 }}>
                  <IconButton edge="end" onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            value={values.password}
            onChange={handleChange}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
            disabled={loading}
          />

          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirmar Contraseña"
            placeholder={'********'}
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 1 }}>
                  <IconButton edge="end" onClick={() => setShowConfirmPassword(prev => !prev)}>
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            value={values.confirmPassword}
            onChange={handleChange}
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
            disabled={loading}
          />

          <Stack direction="column" justifyContent={'center'} alignItems={'center'} spacing={{ xs: 1, md: 0 }}>
            <FormControlLabel
              control={
                <Checkbox
                  {...getFieldProps('terms')}
                  disabled={loading}
                  checked={values?.terms}
                  value={values?.terms}
                />
              }
              label={
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                  He leído y acepto los &nbsp;
                  <Link
                    component={RouterLink}
                    underline="always"
                    color="info.main"
                    to={PUBLIC_PATHS.policies}
                    target="_blank"
                  >
                    Términos y condiciones
                  </Link>
                  &nbsp; & &nbsp;
                  <Link
                    component={RouterLink}
                    underline="always"
                    color="info.main"
                    to={PUBLIC_PATHS.privacy}
                    target="_blank"
                  >
                    Acuerdos de privacidad
                  </Link>
                  .
                </Typography>
              }
            />
            {Boolean(errors.terms) && touched.terms && (
              <Typography variant={'caption'} color={'error'}>
                {errors.terms}
              </Typography>
            )}
          </Stack>

          <LoadingButton
            loading={loading}
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ textTransform: 'uppercase' }}
          >
            Registrar
          </LoadingButton>

          <Button onClick={handleContinueProcess}>{'>> Continuar proceso'}</Button>
        </Stack>
      </Box>
    </>
  )
}

export default CommerceRegisterForm
