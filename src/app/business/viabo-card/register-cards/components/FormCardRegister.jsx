import { AddCard, VpnKey } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Alert, Box, Button, InputAdornment, Stack, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { format, isAfter, isValid, parse } from 'date-fns'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { AssignCardDemoUserAdapter } from '@/app/business/viabo-card/register-cards/adapters'
import { useAssignCardToDemoUser } from '@/app/business/viabo-card/register-cards/hooks'
import { CARD_ASSIGN_PROCESS_LIST } from '@/app/business/viabo-card/register-cards/services'
import { useCardUserAssign } from '@/app/business/viabo-card/register-cards/store'
import { FormProvider, MaskedInput, RFTextField } from '@/shared/components/form'
import { axios } from '@/shared/interceptors'

export default function FormCardRegister() {
  const setStep = useCardUserAssign(state => state.setStepAssignRegister)
  const token = useCardUserAssign(state => state.token)
  const card = useCardUserAssign(state => state.card)
  const { mutate: assignCard, isLoading: isAssigningCard } = useAssignCardToDemoUser()

  const CardSchema = Yup.object().shape({
    cvv: Yup.string().min(3, 'Debe contener 3 digitos').required('El CVV es requerido'),
    expiration: Yup.string()
      .required('La fecha de vencimiento es requerida')
      .test('is-future-date', 'La fecha  debe ser mayor que la fecha actual', function (value) {
        const date = parse(`01/${value}`, 'dd/MM/yyyy', new Date())
        const currentDate = new Date()
        const isDateValid = isValid(date)
        return isDateValid && isAfter(date, currentDate)
      })
  })

  const formik = useFormik({
    initialValues: {
      expiration: '',
      cvv: ''
    },
    validationSchema: CardSchema,
    onSubmit: (values, { setSubmitting }) => {
      const data = AssignCardDemoUserAdapter(values)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      assignCard(data, {
        onSuccess: () => {
          setSubmitting(false)
          setStep(CARD_ASSIGN_PROCESS_LIST.CARD_ASSIGNED)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { isSubmitting, values, setFieldValue, errors, handleSubmit, touched, resetForm, setSubmitting } = formik

  const loading = isSubmitting || isAssigningCard

  return (
    <Stack
      sx={{
        mb: 3
      }}
    >
      <Stack direction="column" width={1} spacing={1} pb={2}>
        <Typography variant="h4" color="textPrimary" align="center">
          Estamos a un paso de completar su registro
        </Typography>
        <Typography paragraph align="center" variant="body1" color={'text.primary'} whiteSpace="pre-line">
          Ingrese la información faltante de la tarjeta para asociarla a su cuenta.
        </Typography>
      </Stack>
      <FormProvider formik={formik}>
        <Stack px={5}>
          <Box
            sx={{
              pb: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <Typography variant={'overline'} color={'primary.main'}>
              {card?.cardNumberHidden}
            </Typography>
          </Box>
          <Alert
            sx={{
              textAlign: 'center',
              width: '100%',
              justifyContent: 'center',
              display: 'flex',
              mb: 2
            }}
            severity="warning"
          >
            <Typography variant="caption" fontWeight={'bold'}>
              En caso de no capturar los datos correctos de la tarjeta, la información de la misma podrá ser erronea.
            </Typography>
          </Alert>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} display={'flex'}>
            <Stack sx={{ width: { xs: '100%', lg: '40%' } }}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                CVV
              </Typography>
              <RFTextField
                name={'cvv'}
                required={true}
                placeholder={'123'}
                size="small"
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
            <Stack>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Vence
              </Typography>
              <DatePicker
                disabled={loading}
                views={['year', 'month']}
                size="small"
                name={'expiration'}
                value={new Date(values.expiration) ?? null}
                onChange={newValue => {
                  const isDateValid = isValid(newValue)
                  if (isDateValid) {
                    return formik.setFieldValue('expiration', format(newValue, 'MM/yyyy'))
                  } else {
                    return formik.setFieldValue('expiration', '')
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: Boolean(touched.expiration && errors.expiration),
                    required: true,
                    helperText: touched.expiration && errors.expiration ? errors.expiration : ''
                  }
                }}
                disablePast={true}
                format="MM/yy"
              />
            </Stack>
          </Stack>
        </Stack>
      </FormProvider>
      <Stack spacing={3} px={5} py={4}>
        <LoadingButton
          size="large"
          loading={loading}
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={<AddCard />}
        >
          Asociar
        </LoadingButton>
        <Button
          size="large"
          variant={'outlined'}
          color={'inherit'}
          onClick={() => {
            setStep(CARD_ASSIGN_PROCESS_LIST.CARD_VALIDATION)
          }}
        >
          Cancelar
        </Button>
      </Stack>
    </Stack>
  )
}
