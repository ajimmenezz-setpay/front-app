import { useState } from 'react'

import { CheckCircle, CreditCard, Lock, Send } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Divider, InputAdornment, Stack, Step, StepLabel, Stepper, Typography, alpha } from '@mui/material'
import { useFormik } from 'formik'
import { motion } from 'framer-motion'
import * as Yup from 'yup'

import { CardCloudTransferBetweenCardsV2Adapter } from '../../../shared/adapters'
import { useFindCardByClientId, useTransferBetweenCardsOfCardCloud } from '../../../shared/hooks'

import { FormLabelTypography, FormProvider, MaskedInput, RFTextField } from '@/shared/components/form'
import { isFunction } from '@/shared/utils'

const steps = ['Buscar Tarjeta Destino', 'Enviar Transferencia']

const CardCloudTransferBetweenCardsForm = ({ onSuccess, onFinish, card }) => {
  const { mutate, isLoading, data: transaction } = useTransferBetweenCardsOfCardCloud()
  const { mutate: searchCard, isLoading: isSearchingCard, data: destinationCard } = useFindCardByClientId()

  const [activeStep, setActiveStep] = useState(0)
  const [failedStep, setFailedStep] = useState(new Set())

  const isStepFailed = step => failedStep.has(step)

  const isLastStep = activeStep === steps.length - 1

  const RegisterSchema = Yup.object().shape({
    clientId: Yup.string().trim().required('Es necesario el client_Id'),
    amount: Yup.string()
      .trim()
      .test('minAmount', 'El monto debe ser mayor a $0.00', function (value) {
        return parseFloat(value?.replace(/,/g, '')) > 0
      })
      .required('El monto es requerido'),
    concept: Yup.string().trim().max(50, 'Máximo 50 caracteres').required('Es necesario el concepto'),
    googleCode: Yup.string()
      .trim()
      .matches(/^0*\d{6}$/, 'El código de Google debe contener exactamente 6 dígitos')
      .required('Es necesario el código de 6 dígitos')
  })

  const formik = useFormik({
    initialValues: {
      clientId: '',
      amount: '',
      concept: '',
      googleCode: ''
    },
    validationSchema: RegisterSchema,
    validateOnChange: false,
    onSubmit: (values, { setFieldValue, setSubmitting }) => {
      if (!isLastStep) {
        return setSubmitting(false)
      }

      let newFailed = failedStep
      if (isStepFailed(activeStep)) {
        newFailed = new Set(newFailed.values())
        newFailed.delete(activeStep)
        setFailedStep(newFailed)
      }

      const data = CardCloudTransferBetweenCardsV2Adapter(values, card, destinationCard)
      return mutate(data, {
        onSuccess: transaction => {
          setSubmitting(false)
          setActiveStep(prevActiveStep => prevActiveStep + 1)
          isFunction(onSuccess) && onSuccess(transaction)
        },
        onError: () => {
          setSubmitting(false)
          setFailedStep(prevSkipped => {
            const newFailed = new Set(prevSkipped.values())
            newFailed.add(activeStep)
            return newFailed
          })
        }
      })
    }
  })

  const { setFieldValue, values, isSubmitting, handleSubmit } = formik

  const loading = isLoading || isSearchingCard || isSubmitting

  const handleNext = () => {
    if (activeStep === 0) {
      if (values.clientId.trim() === '') {
        return null
      }
      return searchCard(
        { clientId: values.clientId.trim() },
        {
          onSuccess: () => {
            let newFailed = failedStep
            if (isStepFailed(activeStep)) {
              newFailed = new Set(newFailed.values())
              newFailed.delete(activeStep)
              setFailedStep(newFailed)
            }
            setActiveStep(prevActiveStep => prevActiveStep + 1)
          },
          onError: () => {
            setFailedStep(prevSkipped => {
              const newFailed = new Set(prevSkipped.values())
              newFailed.add(activeStep)
              return newFailed
            })
          }
        }
      )
    }
    if (activeStep === 1) {
      return null
    }

    return setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleFinish = () => {
    isFunction(onFinish) && onFinish()
    setActiveStep(0)
  }

  return (
    <FormProvider formik={formik}>
      <Box sx={{ width: '100%', display: 'flex', gap: 3, flexDirection: 'column' }}>
        {activeStep !== steps.length && (
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => {
              const stepProps = {}
              const labelProps = {}

              if (isStepFailed(index)) {
                labelProps.optional = (
                  <Typography variant="caption" color="error">
                    Error
                  </Typography>
                )

                labelProps.error = true
              }

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>
        )}

        {activeStep === steps.length && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Stack gap={2}>
              <Stack alignItems={'center'} spacing={1}>
                <CheckCircle sx={{ width: 50, height: 50 }} color={'success'} />
                <Stack alignItems={'center'}>
                  <Typography variant="h6">{`Operación Exitosa`}</Typography>
                  <Typography variant="caption" color={'text.disabled'}>
                    {transaction?.movement?.date?.dateTime}
                  </Typography>
                </Stack>
                <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui', pb: 2 }} variant="h2">
                  {transaction?.movement?.amount?.format?.replace('-', '')}
                </Typography>
                <Stack
                  alignItems={'flex-start'}
                  flexDirection={'row'}
                  py={2}
                  divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                  sx={{ borderRadius: 1, border: theme => `solid 1px ${theme.palette.divider}`, width: 1 }}
                >
                  <Stack px={2} flex={1} justifyContent="center" alignItems={'center'}>
                    <Typography variant="subtitle1">Origen</Typography>
                    <Typography
                      variant="subtitle2"
                      textAlign={'center'}
                      sx={{ textTransform: 'capitalize', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
                    >
                      {card?.number?.masked}
                    </Typography>
                    <Typography
                      variant="caption"
                      textAlign={'center'}
                      sx={{ textTransform: 'capitalize', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
                    >
                      {card?.clientId}
                    </Typography>
                  </Stack>
                  <Stack px={2} flex={1} justifyContent="center" alignItems={'center'}>
                    <Typography variant="subtitle1">Destino</Typography>
                    <Typography
                      variant="subtitle2"
                      textAlign={'center'}
                      sx={{ textTransform: 'capitalize', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
                    >
                      {destinationCard?.maskedPan}
                    </Typography>
                    <Typography
                      variant="caption"
                      textAlign={'center'}
                      sx={{ textTransform: 'capitalize', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
                    >
                      {destinationCard?.clientId}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack
                gap={1}
                sx={{ width: 1 }}
                divider={<Divider orientation="horizontal" flexItem sx={{ borderStyle: 'dashed' }} />}
              >
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="overline">{transaction?.movement?.id}</Typography>
                </Stack>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Orden
                  </Typography>
                  <Typography variant="overline">{transaction?.movement?.order}</Typography>
                </Stack>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Descripción
                  </Typography>
                  <Typography component={'p'} sx={{ textWrap: 'balance', textAlign: 'right' }} variant="overline">
                    {transaction?.movement?.description}
                  </Typography>
                </Stack>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tipo
                  </Typography>
                  <Typography variant="overline">{transaction?.movement?.type}</Typography>
                </Stack>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Monto
                  </Typography>
                  <Typography variant="overline">{transaction?.movement?.amount?.format}</Typography>
                </Stack>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Balance
                  </Typography>
                  <Typography variant="overline">{transaction?.movement?.balance?.format}</Typography>
                </Stack>
              </Stack>
            </Stack>
            <Button sx={{ my: 3 }} fullWidth variant={'outlined'} color="inherit" onClick={handleFinish}>
              Cerrar
            </Button>
          </motion.div>
        )}

        {activeStep === 0 && (
          <>
            <Stack gap={0.5}>
              <FormLabelTypography variant="overline" required fontWeight={'bold'}>
                Ingrese el client_ID de la tarjeta
              </FormLabelTypography>

              <RFTextField
                name={'clientId'}
                size={'large'}
                autoFocus
                required
                placeholder={'CLXXXXXX'}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCard />
                    </InputAdornment>
                  )
                }}
                disabled={loading}
              />
            </Stack>
          </>
        )}
        {activeStep === 1 && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Stack gap={3}>
              <Stack
                justifyContent={'center'}
                alignItems={'center'}
                flexDirection="row"
                sx={{
                  borderRadius: 1,
                  border: theme => `solid 2px ${theme.palette.info.light}`,
                  p: 1,
                  backgroundColor: theme => alpha(theme.palette.info.lighter, 0.25)
                }}
              >
                <Box
                  component={'span'}
                  sx={{ typography: 'subtitle1', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
                >
                  {destinationCard?.maskedPan} - {destinationCard?.clientId}
                </Box>
              </Stack>
              <Stack spacing={0.5}>
                <FormLabelTypography variant="overline" required fontWeight={'bold'}>
                  Monto
                </FormLabelTypography>
                <RFTextField
                  size={'large'}
                  name={'amount'}
                  placeholder={'0.00'}
                  disabled={loading}
                  autoComplete={'off'}
                  required
                  autoFocus
                  InputProps={{
                    startAdornment: <span style={{ marginRight: '5px' }}>$</span>,
                    endAdornment: <span style={{ marginRight: '5px' }}>MXN</span>,
                    inputComponent: MaskedInput,
                    inputProps: {
                      mask: Number,
                      radix: '.',
                      thousandsSeparator: ',',
                      padFractionalZeros: true,
                      min: 0,
                      scale: 2,
                      value: values.amount,
                      onAccept: value => {
                        setFieldValue('amount', value)
                      }
                    }
                  }}
                />
              </Stack>
              <Stack spacing={0.5}>
                <FormLabelTypography variant="overline" required fontWeight={'bold'}>
                  Concepto
                </FormLabelTypography>
                <RFTextField
                  fullWidth
                  name={'concept'}
                  multiline
                  disabled={loading}
                  rows={2}
                  placeholder={'Transferencia ..'}
                />
              </Stack>
              <Stack spacing={0.5}>
                <FormLabelTypography required variant="overline">
                  Token de Google
                </FormLabelTypography>

                <RFTextField
                  name={'googleCode'}
                  type={'text'}
                  placeholder={'000000'}
                  inputProps={{ maxLength: '6' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    )
                  }}
                  disabled={loading}
                />
              </Stack>
            </Stack>
          </motion.div>
        )}

        {activeStep !== steps.length && (
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            {activeStep > 0 && (
              <Button color="inherit" disabled={activeStep === 0 || loading} onClick={handleBack} sx={{ mr: 1 }}>
                Atrás
              </Button>
            )}

            <Box sx={{ flex: '1 1 auto' }} />

            <LoadingButton
              type="submit"
              loading={!!loading}
              variant={isLastStep ? 'contained' : 'outlined'}
              onClick={handleNext}
              startIcon={isLastStep ? <Send /> : undefined}
            >
              {isLastStep ? 'Enviar' : 'Siguiente'}
            </LoadingButton>
          </Box>
        )}
      </Box>
    </FormProvider>
  )
}

export default CardCloudTransferBetweenCardsForm
