import { useEffect } from 'react'

import { CreditCard } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Divider, InputAdornment, Stack, Typography } from '@mui/material'
import { useResponsive } from '@theme/hooks'
import { useFormik } from 'formik'
import { m } from 'framer-motion'
import { MuiOtpInput } from 'mui-one-time-password-input'
import * as Yup from 'yup'

import { useValidateDemoCard } from '@/app/business/viabo-card/register-cards/hooks'
import { CARD_ASSIGN_PROCESS_LIST } from '@/app/business/viabo-card/register-cards/services'
import { useCardUserAssign } from '@/app/business/viabo-card/register-cards/store'
import { varFade } from '@/shared/components/animate'
import { FormProvider, MaskedInput, RFTextField } from '@/shared/components/form'
import { matchIsNumeric } from '@/shared/utils'

export default function FormDemoCardValidation() {
  const setToken = useCardUserAssign(state => state.setToken)
  const setStep = useCardUserAssign(state => state.setStepAssignRegister)
  const setCard = useCardUserAssign(state => state.setCard)
  const resetState = useCardUserAssign(state => state.resetState)

  const isDesktop = useResponsive('up', 'md')

  const { mutate: validateDemoCard, isLoading: validatingCard, reset, isError } = useValidateDemoCard()

  const CardSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .transform((value, originalValue) => originalValue.replace(/\s/g, ''))
      .min(8, 'Debe contener los últimos 8 dígitos')
      .required('El número de la tarjeta es requerido')
  })

  const formik = useFormik({
    initialValues: {
      cardNumber: ''
    },
    validationSchema: CardSchema,
    onSubmit: (values, { setSubmitting }) => {
      validateDemoCard(
        { cardNumber: values?.cardNumber?.replace(/\s+/g, '') },
        {
          onSuccess: data => {
            const { token, ...card } = data
            if (token) {
              setToken(token)
              setCard(card)
              setStep(CARD_ASSIGN_PROCESS_LIST.USER_REGISTER)
            }
            setSubmitting(false)
          },
          onError: () => {
            setSubmitting(false)
          }
        }
      )
    }
  })

  const { isSubmitting, values, setFieldValue, handleSubmit, errors } = formik

  const loading = isSubmitting || validatingCard

  useEffect(() => {
    resetState()
  }, [])

  const handleChange = newValue => {
    if (isError) {
      reset()
    }
    setFieldValue('cardNumber', newValue)
  }

  const validateChar = (value, index) => matchIsNumeric(value)

  return (
    <Stack spacing={5}>
      <Stack direction="column" width={1} spacing={1}>
        <Stack>
          <m.div variants={varFade().inRight}>
            <Typography
              align="center"
              variant="h3"
              sx={{
                color: 'primary.main',
                fontWeight: 'fontWeightMedium'
              }}
            >
              Aquí Comienza
            </Typography>
          </m.div>

          <m.div variants={varFade().inRight}>
            <Typography
              align="center"
              variant="h3"
              sx={{
                color: 'primary.light',
                fontWeight: 'fontWeightMedium'
              }}
            >
              tu agilidad en pagos
            </Typography>
          </m.div>
        </Stack>
        <Typography paragraph align="center" variant="subtitle1" color={'text.primary'} whiteSpace="pre-line">
          Ingrese los 8 últimos dígitos de la tarjeta.
        </Typography>
      </Stack>

      <FormProvider formik={formik}>
        {isDesktop ? (
          <MuiOtpInput
            name={'cardNumber'}
            length={8}
            value={values.cardNumber}
            onChange={handleChange}
            validateChar={validateChar}
            sx={{ gap: 1.5 }}
            TextFieldsProps={{ placeholder: '-', error: isError, disabled: loading, fullWidth: true, type: 'number' }}
          />
        ) : (
          <RFTextField
            name={'cardNumber'}
            required={true}
            placeholder={'9717 8968'}
            fullWidth
            size={'small'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCard />
                </InputAdornment>
              ),
              inputComponent: MaskedInput,
              inputProps: {
                mask: '0000 0000',
                value: values.cardNumber,
                onAccept: value => {
                  setFieldValue('cardNumber', value)
                }
              }
            }}
            disabled={loading}
          />
        )}
      </FormProvider>
      <Stack spacing={3} px={5}>
        <Stack>
          <Typography paragraph align="center" variant="body2" color={'text.primary'}>
            Iniciemos el proceso de asociación de tu cuenta.
          </Typography>
          <Divider />
        </Stack>
        <Stack alignItems={'center'} justifyContent={'center'}>
          <LoadingButton
            loading={loading}
            variant="contained"
            size="large"
            color="primary"
            fullWidth
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ width: 150 }}
          >
            Validar
          </LoadingButton>
        </Stack>
      </Stack>
    </Stack>
  )
}
