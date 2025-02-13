import { lazy, useState } from 'react'

import { EmailTwoTone } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { InputAdornment, Paper, Stack, Step, StepLabel, Stepper } from '@mui/material'
import { useFormik } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import * as Yup from 'yup'

import { ColorlibConnector, ColorStepIconRecoverPassword } from './RecoverPasswordStepStyles'

import { useValidateUserEmail } from '@/app/authentication/recovery-account/hooks'
import { useSendValidationCode } from '@/app/business/shared/hooks'
import { FormLabelTypography, FormProvider, RFTextField } from '@/shared/components/form'
import { Lodable } from '@/shared/components/lodables'
import { axios } from '@/shared/interceptors'

const RecoverPasswordValidationCode = Lodable(lazy(() => import('./RecoverPasswordValidationCode')))

const steps = ['Validar Correo', 'Recuperar Cuenta']

const RecoverPasswordSteps = () => {
  const { mutate, isLoading: isValidating } = useValidateUserEmail()
  const { mutate: sendValidationCode, isLoading: isSendingCode } = useSendValidationCode()
  const [activeStep, setActiveStep] = useState(0)
  const [token, setToken] = useState(null)

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const ValidationSchema = Yup.object().shape({
    email: Yup.string().trim().email('Ingrese un correo valido').required('Es necesario el correo electrónico')
  })

  const formikValidation = useFormik({
    initialValues: {
      email: ''
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      mutate(values, {
        onSuccess: data => {
          setToken(data?.token)
          axios.defaults.headers.common.Authorization = `Bearer ${data?.token}`

          sendValidationCode(
            { token: data?.token },
            {
              onSuccess: () => {
                setSubmitting(false)

                handleNext()
              },
              onError: () => {
                setSubmitting(false)
                setToken(null)
                delete axios.defaults.headers.common.Authorization
              }
            }
          )
        },
        onError: () => {
          setSubmitting(false)
          setToken(null)
          delete axios.defaults.headers.common.Authorization
        }
      })
    }
  })

  const loading = formikValidation.isSubmitting || isValidating || isSendingCode

  return (
    <Stack flexGrow={1}>
      <Stack flex={1} justifyContent={'center'} gap={4}>
        <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'inherit' }}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorStepIconRecoverPassword}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
        <AnimatePresence>
          {activeStep === 0 && (
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <FormProvider formik={formikValidation}>
                <Stack gap={3}>
                  <Stack gap={1}>
                    <FormLabelTypography required fontWeight={'bold'}>
                      Ingrese su correo para buscar su cuenta
                    </FormLabelTypography>

                    <RFTextField
                      name={'email'}
                      placeholder={'usuario@dominio.com'}
                      required
                      fullWidth
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
                      Validar Correo
                    </LoadingButton>
                  </Stack>
                </Stack>
              </FormProvider>
            </motion.div>
          )}
          {activeStep === 1 && <RecoverPasswordValidationCode token={token} email={formikValidation.values.email} />}
        </AnimatePresence>
      </Stack>
    </Stack>
  )
}

export default RecoverPasswordSteps
