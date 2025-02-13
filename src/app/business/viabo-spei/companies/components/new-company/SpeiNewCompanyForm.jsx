import PropTypes from 'prop-types'

import { EmailOutlined, Phone } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { METHODS_NEW_COMPANY_USERS, SpeiNewCompanyAdapter } from '../../adapters'
import { useCreateNewSpeiCompany, useUpdateSpeiCompany } from '../../hooks'

import { FormProvider, IOSSwitch, RFSelect, RFTextField } from '@/shared/components/form'

const MIN_AMOUNT = 0
const STEP = 0.01

const SpeiNewCompanyForm = ({ adminCompanyUsers, costCenters, concentrators, company, commissions, onSuccess }) => {
  const { mutate, isLoading } = useCreateNewSpeiCompany()
  const { mutate: updateCompany, isLoading: isUpdatingCompany } = useUpdateSpeiCompany()

  const MAX_AMOUNT_PERCENTAGE = commissions?.percentage || 15
  const MAX_AMOUNT = commissions?.amount || 20

  const percentageValidation = Yup.number()
    .min(MIN_AMOUNT, 'El valor mínimo es 0')
    .max(MAX_AMOUNT_PERCENTAGE, `El valor máximo es ${MAX_AMOUNT_PERCENTAGE}`)
    .required('El valor es requerido')

  const amountValidation = Yup.number()
    .min(MIN_AMOUNT, 'El valor mínimo es 0')
    .max(MAX_AMOUNT, `El valor máximo es ${MAX_AMOUNT}`)
    .required('El valor es requerido')

  const ValidationSchema = Yup.object().shape({
    fiscalName: Yup.string().trim().required('Es necesario el nombre fiscal'),
    rfc: Yup.string().trim().required('Es necesario el rfc'),
    commercialName: Yup.string().trim().max(100, 'Máximo 100 caracteres'),
    concentrator: Yup.object().nullable().required('Es necesario la concentradora'),
    adminUsers: Yup.array().when('method', {
      is: METHODS_NEW_COMPANY_USERS.ADMIN_USERS,
      then: schema => schema.min(1, 'Es necesario al menos un usuario administrador asignado a la empresa'),
      otherwise: schema => Yup.array()
    }),
    adminName: Yup.string()
      .trim()
      .when('method', {
        is: METHODS_NEW_COMPANY_USERS.NEW_ADMIN_USER,
        then: schema => schema.required('Es necesario el nombre del administrador'),
        otherwise: schema => Yup.string().trim()
      }),
    adminLastName: Yup.string()
      .trim()
      .when('method', {
        is: METHODS_NEW_COMPANY_USERS.NEW_ADMIN_USER,
        then: schema => schema.required('Es necesario los apellidos del administrador'),
        otherwise: schema => Yup.string().trim()
      }),
    adminEmail: Yup.string()
      .trim()
      .email('Ingrese un correo valido')
      .when('method', {
        is: METHODS_NEW_COMPANY_USERS.NEW_ADMIN_USER,
        then: schema => schema.required('Es necesario el correo del administrador'),
        otherwise: schema => Yup.string().trim().email('Ingrese un correo valido')
      }),
    adminPhone: Yup.string().trim(),
    hasViaboCard: Yup.bool(),
    costCenters: Yup.array(),
    speiOut: percentageValidation,
    internalTransferCompany: percentageValidation,
    fee: amountValidation,
    speiIn: percentageValidation
  })

  const formik = useFormik({
    initialValues: {
      fiscalName: company?.fiscalName || '',
      commercialName: company?.commercialName || '',
      concentrator: concentrators?.find(concentrator => concentrator?.value === company?.concentrator?.id) || null,
      rfc: company?.rfc || '',
      method: METHODS_NEW_COMPANY_USERS.ADMIN_USERS,
      adminUsers: adminCompanyUsers?.filter(admin => company?.adminUsers?.includes(admin?.value)) || [],
      costCenters: costCenters?.filter(costCenter => company?.costCenters?.includes(costCenter?.value)) || [],
      adminName: '',
      adminLastName: '',
      adminEmail: '',
      adminPhone: '',
      hasViaboCard: true,
      speiOut: company?.commissions?.speiOut || 0,
      internalTransferCompany: company?.commissions?.internalTransferCompany || 0,
      fee: company?.commissions?.fee || 0,
      speiIn: company?.commissions?.speiIn || 0
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting, setFieldValue }) => {
      const newCompany = SpeiNewCompanyAdapter(values)

      if (company) {
        return updateCompany(
          { ...newCompany, id: company?.id },
          {
            onSuccess: () => {
              onSuccess()
              setSubmitting(false)
            },
            onError: () => {
              setSubmitting(false)
            }
          }
        )
      }

      return mutate(newCompany, {
        onSuccess: () => {
          onSuccess()
          setSubmitting(false)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { isSubmitting, setFieldValue, values, setTouched } = formik

  const loading = isSubmitting || isLoading || isUpdatingCompany

  const theme = useTheme()

  return (
    <FormProvider formik={formik}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Nombre Fiscal
            <Box component={'span'} color={'error.main'} ml={0.5}>
              *
            </Box>
          </Typography>

          <RFTextField
            required
            name={'fiscalName'}
            size={'small'}
            disabled={loading}
            placeholder={'Nombre Fiscal de la Empresa...'}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            RFC
            <Box component={'span'} color={'error.main'} ml={0.5}>
              *
            </Box>
          </Typography>
          {company ? (
            <Typography variant={'subtitle1'}>{values?.rfc}</Typography>
          ) : (
            <RFTextField required name={'rfc'} size={'small'} placeholder={'RFC de la Empresa...'} disabled={loading} />
          )}
        </Stack>

        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Nombre Comercial
          </Typography>

          <RFTextField
            inputProps={{ maxLength: '100' }}
            name={'commercialName'}
            size={'small'}
            placeholder={'Nombre Comercial de la Empresa...'}
            disabled={loading}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Concentradora STP{' '}
            <Box component={'span'} color={'error.main'} ml={0.5}>
              *
            </Box>
          </Typography>

          <RFSelect
            name={'concentrator'}
            textFieldParams={{ placeholder: 'Seleccionar ...', size: 'small', required: true }}
            options={concentrators || []}
            disabled={loading}
          />
        </Stack>

        <Stack>
          <FormControl disabled={loading}>
            <FormLabel id="demo-row-radio-buttons-group-label">Seleccione al administrador de la empresa:</FormLabel>
            <RadioGroup
              value={values.method}
              onChange={e => {
                !company && setFieldValue('adminUsers', [])
                setFieldValue('adminName', '')
                setFieldValue('adminLastName', '')
                setFieldValue('adminEmail', '')
                setFieldValue('adminPhone', '')
                setFieldValue('method', e.target.value)
                setTouched({}, false)
              }}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value={METHODS_NEW_COMPANY_USERS.ADMIN_USERS}
                control={<Radio />}
                label="Administrador de Empresa Existente"
              />
              <FormControlLabel
                value={METHODS_NEW_COMPANY_USERS.NEW_ADMIN_USER}
                control={<Radio />}
                label="Nuevo Administrador de Empresa"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
        {values.method === METHODS_NEW_COMPANY_USERS.ADMIN_USERS ? (
          <Stack spacing={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Usuarios Administradores
              <Box component={'span'} color={'error.main'} ml={0.5}>
                *
              </Box>
            </Typography>

            <RFSelect
              multiple
              name={'adminUsers'}
              textFieldParams={{ placeholder: 'Seleccionar ...', size: 'small' }}
              options={adminCompanyUsers || []}
              disabled={loading}
            />
          </Stack>
        ) : (
          <>
            <Stack spacing={1}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Nombre (s)
                <Box component={'span'} color={'error.main'} ml={0.5}>
                  *
                </Box>
              </Typography>

              <RFTextField
                name={'adminName'}
                size={'small'}
                required
                placeholder={'Nombre Administrador de la Empresa...'}
                disabled={loading}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Apellido (s)
                <Box component={'span'} color={'error.main'} ml={0.5}>
                  *
                </Box>
              </Typography>

              <RFTextField
                name={'adminLastName'}
                size={'small'}
                required
                placeholder={'Apellidos del Administrador de la Empresa...'}
                disabled={loading}
              />
            </Stack>

            <Stack flexDirection={{ md: 'row' }} gap={2}>
              <Stack spacing={1} flex={1}>
                <Typography type={'email'} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Correo
                  <Box component={'span'} color={'error.main'} ml={0.5}>
                    *
                  </Box>
                </Typography>

                <RFTextField
                  name={'adminEmail'}
                  size={'small'}
                  required
                  placeholder={'admin.company@domino.com...'}
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

              <Stack spacing={1}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Teléfono
                </Typography>
                <RFTextField
                  name={'adminPhone'}
                  type={'tel'}
                  size={'small'}
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
          </>
        )}

        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Centros de Costos
          </Typography>

          <RFSelect
            multiple
            name={'costCenters'}
            textFieldParams={{ placeholder: 'Seleccionar ...', size: 'small' }}
            options={costCenters || []}
            disabled={loading}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Servicios
          </Typography>

          <Stack justifyContent={'space-between'} flexDirection={'row'} alignItems={'center'}>
            <Typography variant="h6" color={'primary.main'}>
              Card Cloud
            </Typography>

            <IOSSwitch
              disabled={loading}
              size="md"
              color={!values.hasViaboCard ? 'error' : 'success'}
              checked={Boolean(values.hasViaboCard) || false}
              inputProps={{ 'aria-label': 'controlled' }}
              onChange={() => {
                setFieldValue('hasViaboCard', !values.hasViaboCard)
              }}
            />
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Comisiones de salida
          </Typography>
          <Stack gap={3}>
            <RFTextField
              name="speiOut"
              placeholder="0.0"
              label="SPEI Out - Terceros"
              size={'small'}
              type="number"
              required={true}
              disabled={loading}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">%</InputAdornment>
              }}
              inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, max: MAX_AMOUNT_PERCENTAGE, step: STEP }}
            />

            <RFTextField
              name="internalTransferCompany"
              placeholder="0.0"
              label="Transferencia Interna - Empresas"
              size={'small'}
              type="number"
              required={true}
              disabled={loading}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">%</InputAdornment>
              }}
              inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, max: MAX_AMOUNT_PERCENTAGE, step: STEP }}
            />

            <RFTextField
              name="fee"
              placeholder="0.0"
              size={'small'}
              label="Fee - STP"
              type="number"
              required={true}
              disabled={loading}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                endAdornment: <InputAdornment position="start">MXN</InputAdornment>
              }}
              inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, max: MAX_AMOUNT, step: STEP }}
            />
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Comisiones de entrada
          </Typography>
          <Stack gap={3}>
            <RFTextField
              name="speiIn"
              placeholder="0.0"
              label="SPEI In - Externo"
              size={'small'}
              type="number"
              required={true}
              disabled={loading}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                endAdornment: <InputAdornment position="start">%</InputAdornment>
              }}
              inputProps={{ inputMode: 'numeric', min: MIN_AMOUNT, max: MAX_AMOUNT_PERCENTAGE, step: STEP }}
            />
          </Stack>
        </Stack>

        <Stack sx={{ pt: 1 }}>
          <LoadingButton size={'large'} loading={loading} variant="contained" color="primary" fullWidth type="submit">
            {company ? 'Actualizar' : 'Crear'}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

SpeiNewCompanyForm.propTypes = {
  adminCompanyUsers: PropTypes.array,
  commissions: PropTypes.shape({
    amount: PropTypes.number,
    percentage: PropTypes.number
  }),
  company: PropTypes.shape({
    adminUsers: PropTypes.array,
    commercialName: PropTypes.string,
    commissions: PropTypes.shape({
      fee: PropTypes.number,
      internalTransferCompany: PropTypes.number,
      speiIn: PropTypes.number,
      speiOut: PropTypes.number
    }),
    concentrator: PropTypes.shape({
      id: PropTypes.any
    }),
    costCenters: PropTypes.array,
    fiscalName: PropTypes.string,
    id: PropTypes.any,
    rfc: PropTypes.string
  }),
  concentrators: PropTypes.array,
  costCenters: PropTypes.array,
  onSuccess: PropTypes.func
}

export default SpeiNewCompanyForm
