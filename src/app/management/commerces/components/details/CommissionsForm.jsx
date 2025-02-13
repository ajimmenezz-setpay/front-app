import PropTypes from 'prop-types'

import { LoadingButton } from '@mui/lab'
import { Box, Divider, InputAdornment, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { CommerceCommissionsAdapter } from '../../adapters'
import { useUpdateCommerceCommissions } from '../../hooks'

import { FormProvider, RFTextField } from '@/shared/components/form'
import { CarnetLogo, MasterCardLogo, ViaboCoin, ViaboPayLogo } from '@/shared/components/images'

CommissionsForm.propTypes = {
  commerce: PropTypes.object.isRequired,
  onSuccess: PropTypes.func
}

const MIN_AMOUNT = 0
const MAX_AMOUNT = 50
const STEP = 0.1

function CommissionsForm({ commerce, onSuccess }) {
  const { commissions } = commerce
  const { mutate, isLoading: isUpdatingCommissions } = useUpdateCommerceCommissions()

  const percentageValidation = Yup.number()
    .min(MIN_AMOUNT, 'El valor mínimo es 0')
    .max(MAX_AMOUNT, 'El valor máximo es 50')
    .required('El valor es requerido')

  const registerValidation = Yup.object({
    speiInCarnet: percentageValidation,
    speiOutCarnet: percentageValidation,
    speiInMasterCard: percentageValidation,
    speiOutMasterCard: percentageValidation,
    viaboPay: percentageValidation,
    cloud: percentageValidation
  })

  const formik = useFormik({
    initialValues: {
      speiInCarnet: commissions?.speiInCarnet || 0,
      speiOutCarnet: commissions?.speiOutCarnet || 0,
      speiInMasterCard: commissions?.speiInMasterCard || 0,
      speiOutMasterCard: commissions?.speiOutMasterCard || 0,
      viaboPay: commissions?.viaboPay || 0,
      cloud: commissions?.cloud || 0
    },
    validationSchema: registerValidation,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      const data = CommerceCommissionsAdapter(values, commerce?.id)
      mutate(data, {
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

  const { isSubmitting } = formik

  const isLoading = isSubmitting || isUpdatingCommissions

  return (
    <FormProvider formik={formik}>
      <Stack p={3} gap={3} flexDirection={'column'}>
        <Stack gap={2}>
          <Typography variant="subtitle2">SPEI</Typography>
          <Stack gap={3} flexDirection={'row'} flexWrap={'wrap'} alignItems={'center'} width={1}>
            <CarnetLogo />

            <Stack spacing={1} flexGrow={1}>
              <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Entrantes:
              </Typography>
              <RFTextField
                name="speiInCarnet"
                placeholder="0.0"
                autoFocus
                focused
                size={'small'}
                type="number"
                required={true}
                disabled={isLoading}
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">%</InputAdornment>
                }}
                inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, max: MAX_AMOUNT, step: STEP }}
              />
            </Stack>

            <Stack spacing={1} flexGrow={1}>
              <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Salientes:
              </Typography>
              <RFTextField
                name="speiOutCarnet"
                placeholder="0"
                type="number"
                required={true}
                size={'small'}
                disabled={isLoading}
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">%</InputAdornment>
                }}
                inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, max: MAX_AMOUNT, step: STEP }}
              />
            </Stack>
          </Stack>

          <Stack gap={3} flexDirection={'row'} flexWrap={'wrap'} alignItems={'center'} width={1}>
            <MasterCardLogo />

            <Stack spacing={1} flexGrow={1}>
              <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Entrantes:
              </Typography>
              <RFTextField
                name="speiInMasterCard"
                placeholder="0"
                required={true}
                size={'small'}
                type="number"
                disabled={isLoading}
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">%</InputAdornment>
                }}
                inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, max: MAX_AMOUNT, step: STEP }}
              />
            </Stack>

            <Stack spacing={1} flexGrow={1}>
              <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Salientes:
              </Typography>
              <RFTextField
                name="speiOutMasterCard"
                placeholder="0"
                required={true}
                type="number"
                size={'small'}
                disabled={isLoading}
                InputLabelProps={{
                  shrink: true
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">%</InputAdornment>
                }}
                inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, max: MAX_AMOUNT, step: STEP }}
              />
            </Stack>
          </Stack>
        </Stack>
        <Divider flexItem sx={{ borderStyle: 'dashed' }} />
        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Stack gap={2} alignItems={'center'} flexDirection={'row'}>
            <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
              <ViaboPayLogo sx={{ width: 40, height: 40 }} />
            </Stack>
            <RFTextField
              name="viaboPay"
              placeholder="0"
              size={'small'}
              type="number"
              required={true}
              disabled={isLoading}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">%</InputAdornment>
              }}
              inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, max: MAX_AMOUNT, step: STEP }}
            />
          </Stack>

          <Stack gap={2} flexDirection={'row'} alignItems={'center'}>
            <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
              <ViaboCoin sx={{ width: 35, height: 35 }} />
            </Stack>

            <RFTextField
              name="cloud"
              placeholder="0"
              size={'small'}
              type="number"
              required={true}
              disabled={isLoading}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">%</InputAdornment>
              }}
              inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, max: MAX_AMOUNT, step: STEP }}
            />
          </Stack>
        </Stack>

        <Box display={'flex'} pt={2}>
          <LoadingButton fullWidth loading={isLoading} variant={'contained'} type="submit" sx={{ fontWeight: 'bold' }}>
            Guardar
          </LoadingButton>
        </Box>
      </Stack>
    </FormProvider>
  )
}

export default CommissionsForm
