import { useMemo } from 'react'

import PropTypes from 'prop-types'

import { AddCard, EmailOutlined, VpnKey } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Alert, InputAdornment, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { MuiTelInput } from 'mui-tel-input'
import * as Yup from 'yup'

import { AssignCardsAdapter } from '@/app/business/viabo-card/all-commerce-cards/adapters'
import { useAssignCards } from '@/app/business/viabo-card/all-commerce-cards/hooks'
import { FormProvider, MaskedInput, RFTextField } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'

function FormAssignCards({ cards, onSuccess }) {
  const { mutate: assignCards, isLoading: isAssigning } = useAssignCards()

  const emptyCVV = useMemo(() => Boolean(cards?.length > 0 && cards[0].cvv === ''), [cards])

  const registerValidation = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    email: Yup.string().email('Ingresa un correo valido').required('El correo es requerido'),
    phone: Yup.string().test(
      'longitud',
      'El telefono es muy corto',
      value => !(value && value.replace(/[\s+]/g, '').length < 10)
    ),
    ...(emptyCVV && {
      cvv: Yup.string().min(3, 'Debe contener 3 digitos').required('El CVV es requerido')
    })
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      ...(emptyCVV && {
        cvv: ''
      })
    },
    validationSchema: registerValidation,
    onSubmit: values => {
      const data = AssignCardsAdapter(values, cards, emptyCVV)
      assignCards(data, {
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

  const { errors, touched, isSubmitting, setFieldValue, values, setSubmitting } = formik

  const loading = isSubmitting || isAssigning

  return (
    <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
      <FormProvider formik={formik}>
        <Stack spacing={3} sx={{ p: 3 }}>
          {emptyCVV && (
            <Alert
              sx={{
                textAlign: 'center',
                width: '100%',
                justifyContent: 'center',
                display: 'flex'
              }}
              severity="warning"
            >
              <Typography variant="caption" fontWeight={'bold'}>
                En caso de no capturar los datos correctos de la tarjeta, la información de la misma podrá ser erronea.
              </Typography>
            </Alert>
          )}
          <Stack>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Nombre
            </Typography>
            <RFTextField name={'name'} required={true} placeholder={'Usuario'} disabled={loading} />
          </Stack>

          <Stack>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Correo Electrónico
            </Typography>
            <RFTextField
              name={'email'}
              required={true}
              placeholder={'usuario@dominio.com'}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined />
                  </InputAdornment>
                )
              }}
            />
          </Stack>

          <Stack>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Telefono
            </Typography>
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
          {emptyCVV && (
            <Stack>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                CVV
              </Typography>
              <RFTextField
                name={'cvv'}
                fullWidth
                required={true}
                placeholder={'123'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey />
                    </InputAdornment>
                  ),
                  inputComponent: MaskedInput,
                  inputProps: {
                    mask: '000',
                    onAccept: value => {
                      setFieldValue('cvv', value)
                    },
                    value: values.cvv
                  }
                }}
                disabled={loading}
              />
            </Stack>
          )}

          <Stack sx={{ pt: 3 }}>
            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              startIcon={<AddCard />}
            >
              Asociar
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Scrollbar>
  )
}

export default FormAssignCards

FormAssignCards.propTypes = {
  cards: PropTypes.array,
  onSuccess: PropTypes.func
}
