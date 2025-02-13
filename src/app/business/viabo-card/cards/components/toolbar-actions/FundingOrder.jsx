import { useState } from 'react'

import { Check, CheckCircle, CopyAll, Email } from '@mui/icons-material'
import LinkIcon from '@mui/icons-material/Link'
import { LoadingButton } from '@mui/lab'
import {
  FormHelperText,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { stringToColor } from '@theme/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useFormik } from 'formik'
import { MuiChipsInput } from 'mui-chips-input'
import { Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'

import { CreateFundingOrderAdapter } from '@/app/business/viabo-card/cards/adapters'
import { useCreateFundingOrder, useSharedFundingOrder } from '@/app/business/viabo-card/cards/hooks'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { RightPanel } from '@/app/shared/components'
import { getOperationTypeByName } from '@/app/shared/services'
import { FormProvider, RFTextField } from '@/shared/components/form'
import { Scrollbar } from '@/shared/components/scroll'
import { copyToClipboard, fCurrency } from '@/shared/utils'

const MIN_AMOUNT = 0
const MAX_AMOUNT = 1000000
const STEP = 10

const SHARED_TYPES = {
  EMAIL: 'email',
  SMS: 'sms'
}

const FUNDING_PROCESSORS_TYPES = [
  { label: 'SPEI', value: '1' },
  { label: 'PAYCASH', value: '2' }
]

export function FundingOrder() {
  const openFundingOrder = useCommerceDetailsCard(state => state.openFundingOrder)
  const resetFundingOrder = useCommerceDetailsCard(state => state.resetFundingOrder)
  const fundingCard = useCommerceDetailsCard(state => state.fundingCard)

  const { mutate: fundingOrder, isLoading: isCreatingFundingOrder, data } = useCreateFundingOrder()
  const { mutate: sharedFundingOrder, isLoading: isSharingFundingOrder } = useSharedFundingOrder()

  const [copied, setCopied] = useState(false)
  const [chipInputValue, setChipInputValue] = useState('')

  const SharedSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError('El monto debe ser un número')
      .required('El monto es requerido')
      .min(1, 'El monto debe ser mayor igual que 1'),
    emails: Yup.array().when('step', {
      is: 2,
      then: schema =>
        Yup.array()
          .of(Yup.string().email('Deben ser direcciones de correo válidos'))
          .min(1, 'Las correos son requeridos'),
      otherwise: schema => Yup.array().notRequired()
    }),
    processorTypes: Yup.array().of(Yup.string()).min(1, 'Al menos un tipo de procesador es requerido'),
    step: Yup.number()
  })

  const formik = useFormik({
    initialValues: {
      amount: '',
      emails: [],
      processorTypes: [],
      step: 1
    },
    validationSchema: SharedSchema,
    onSubmit: (values, { setSubmitting, setFieldValue }) => {
      const data = CreateFundingOrderAdapter(values, fundingCard)
      fundingOrder(data, {
        onSuccess: () => {
          setSubmitting(false)
          setFieldValue('step', 2)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { isSubmitting, values, touched, errors, setFieldValue, resetForm } = formik
  const { amount } = values
  const loading = isSubmitting || isCreatingFundingOrder

  const handleClose = () => {
    resetFundingOrder()
    resetForm()
  }

  const handleChipInputChange = value => {
    if (value.trim().length > 0 && value.includes(' ')) {
      const emailArray = value.trim().split(/[, ]+/)
      setFieldValue('emails', [...values.emails, ...emailArray])
      setChipInputValue('')
    } else {
      setChipInputValue(value)
    }
  }

  const handleBlur = event => {
    const value = event.target.value?.trim()
    if (value.length > 0) {
      setFieldValue('emails', [...values.emails, value])
      setChipInputValue('')
    }
  }

  const handleChange = (event, processorTypes) => {
    setFieldValue('processorTypes', processorTypes)
  }

  const handleShared = sharedType => async event => {
    sharedFundingOrder(
      { fundingOrderId: data?.id, emails: values?.emails },
      {
        onSuccess: () => {
          handleClose()
        },
        onError: () => {}
      }
    )
  }

  return (
    <RightPanel open={openFundingOrder} handleClose={handleClose} title={'Orden de Fondeo'}>
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <FormProvider formik={formik}>
          <Stack spacing={3} sx={{ p: 3 }}>
            {values.step === 1 && (
              <>
                <Stack spacing={2}>
                  <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                    Ingresa La Cantidad
                  </Typography>
                  <Stack flexDirection={'row'} gap={1} alignItems={'center'} justifyContent={'center'}>
                    <RFTextField
                      fullWidth
                      placeholder={'0.00'}
                      disabled={loading}
                      name={'amount'}
                      type={'number'}
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        startAdornment: <span style={{ marginRight: '5px' }}>$</span>,
                        endAdornment: <InputAdornment position="end">MXN</InputAdornment>
                      }}
                      inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, step: 'any' }}
                    />
                  </Stack>
                  <Stack spacing={2}>
                    <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                      Procesadores de Fondeo
                    </Typography>
                    <ToggleButtonGroup
                      color="primary"
                      value={values.processorTypes}
                      disabled={loading}
                      onChange={handleChange}
                      aria-label="processors types"
                    >
                      {FUNDING_PROCESSORS_TYPES?.map(processor => {
                        const methodLogo = getOperationTypeByName(processor?.label)
                        if (methodLogo) {
                          const Logo = methodLogo.component
                          return (
                            <ToggleButton key={processor?.value} value={processor?.value} aria-label={processor?.value}>
                              <Logo />
                            </ToggleButton>
                          )
                        }
                        return null
                      })}
                    </ToggleButtonGroup>
                    {!!errors.processorTypes && (
                      <FormHelperText error={!!errors.processorTypes}>{errors.processorTypes}</FormHelperText>
                    )}
                  </Stack>
                </Stack>
                <LoadingButton loading={loading} type="submit" fullWidth color={'primary'} variant={'outlined'}>
                  Crear Orden
                </LoadingButton>
              </>
            )}

            {values.step === 2 && (
              <Stack flexDirection="column" alignItems={'center'} justifyContent={'space-between'} spacing={2}>
                <Stack flexDirection="column" alignItems={'center'} spacing={2}>
                  <CheckCircle sx={{ width: 40, height: 40 }} color={'success'} />
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Typography variant="h3"> {fCurrency(amount)}</Typography>
                    <Typography variant="caption">MXN</Typography>
                  </Stack>

                  <Typography variant="h6">{`Orden de Fondeo: ${data?.reference}`}</Typography>
                </Stack>
                <Stack flexDirection="column" alignItems={'center'} justifyContent={'space-between'} spacing={0}>
                  <Stack justifyContent={'center'} alignItems={'center'} direction="row" spacing={1}>
                    <LinkIcon />
                    <Link
                      component={RouterLink}
                      underline="always"
                      to={`/orden-fondeo/${data?.reference}`}
                      target="_blank"
                      color="info.main"
                    >
                      {`${window.location.host}/orden-fondeo/${data?.reference}`}
                    </Link>
                    <IconButton
                      variant="outlined"
                      size="small"
                      color={copied ? 'success' : 'inherit'}
                      onClick={() => {
                        setCopied(true)
                        copyToClipboard(`${window.location.host}/orden-fondeo/${data?.reference}`)
                        setTimeout(() => {
                          setCopied(false)
                        }, 1000)
                      }}
                    >
                      {copied ? <Check sx={{ color: 'success' }} /> : <CopyAll sx={{ color: 'text.disabled' }} />}
                    </IconButton>
                  </Stack>
                </Stack>
                <Typography variant="caption" color={'text.disabled'}>
                  {format(new Date(), 'dd MMM yyyy hh:mm a', { locale: es })}
                </Typography>

                <Stack spacing={1} width={1}>
                  <Typography variant="caption">¿Desea enviar la orden de fondeo?</Typography>
                  <MuiChipsInput
                    disableEdition
                    name={'emails'}
                    fullWidth
                    disabled={loading}
                    placeholder="Escribe los correos para compartir"
                    value={values?.emails || []}
                    helperText={touched.emails && errors.emails ? errors.emails : ''}
                    error={Boolean(touched.emails && errors.emails)}
                    onChange={value => {
                      setFieldValue('emails', value)
                    }}
                    renderChip={(Component, key, props) => (
                      <Component
                        {...props}
                        variant={'filled'}
                        sx={{
                          fontWeight: 'bolder',
                          backgroundColor: stringToColor(props?.label || ''),
                          color: 'white',
                          '& .MuiChip-deleteIcon': { color: 'white' }
                        }}
                        key={key}
                      />
                    )}
                    onBlur={handleBlur}
                    onInputChange={handleChipInputChange}
                    inputValue={chipInputValue}
                  />
                </Stack>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  disabled={values.emails?.length <= 0}
                  loading={isSharingFundingOrder}
                  fullWidth
                  onClick={handleShared(SHARED_TYPES.EMAIL)}
                  startIcon={<Email />}
                >
                  Enviar Orden
                </LoadingButton>
              </Stack>
            )}
          </Stack>
        </FormProvider>
      </Scrollbar>
    </RightPanel>
  )
}
