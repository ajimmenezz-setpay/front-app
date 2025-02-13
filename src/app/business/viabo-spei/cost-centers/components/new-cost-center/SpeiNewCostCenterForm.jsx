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
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { METHODS_NEW_COST_CENTER_USERS, SpeiNewCostCenterAdapter } from '../../adapters'
import { useCreateNewSpeiCostCenter, useUpdateCostCenter } from '../../hooks'

import { FormProvider, RFSelect, RFTextField } from '@/shared/components/form'

const SpeiNewCostCenterForm = ({ adminUsers, onSuccess, costCenter }) => {
  const { mutate, isLoading } = useCreateNewSpeiCostCenter()
  const { mutate: updateCostCenter, isLoading: isUpdatingCostCenter } = useUpdateCostCenter()

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().trim().max(60, 'Máximo 60 caracteres').required('Es necesario el nombre del centro de costos'),
    method: Yup.string(),
    adminUsers: Yup.array().when('method', {
      is: METHODS_NEW_COST_CENTER_USERS.ADMIN_USERS,
      then: schema => schema.min(1, 'Es necesario al menos un usuario administrador asignado al centro de costos'),
      otherwise: schema => Yup.array()
    }),
    adminName: Yup.string()
      .trim()
      .when('method', {
        is: METHODS_NEW_COST_CENTER_USERS.NEW_ADMIN_USER,
        then: schema => schema.required('Es necesario el nombre del administrador'),
        otherwise: schema => Yup.string().trim()
      }),
    adminLastName: Yup.string()
      .trim()
      .when('method', {
        is: METHODS_NEW_COST_CENTER_USERS.NEW_ADMIN_USER,
        then: schema => schema.required('Es necesario los apellidos del administrador'),
        otherwise: schema => Yup.string().trim()
      }),
    adminEmail: Yup.string()
      .trim()
      .email('Ingrese un correo valido')
      .when('method', {
        is: METHODS_NEW_COST_CENTER_USERS.NEW_ADMIN_USER,
        then: schema => schema.required('Es necesario el correo del administrador'),
        otherwise: schema => Yup.string().trim().email('Ingrese un correo valido')
      }),
    adminPhone: Yup.string().trim()
  })

  const adminUsersValues = adminUsers?.filter(user => costCenter?.adminUsers?.includes(user?.value)) || []

  const formik = useFormik({
    initialValues: {
      name: costCenter?.name || '',
      method: METHODS_NEW_COST_CENTER_USERS.ADMIN_USERS,
      adminUsers: adminUsersValues,
      adminName: '',
      adminLastName: '',
      adminEmail: '',
      adminPhone: ''
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: (values, { setSubmitting, setFieldValue }) => {
      const newCostCenter = SpeiNewCostCenterAdapter(values)
      if (costCenter) {
        return updateCostCenter(
          { ...newCostCenter, id: costCenter?.id },
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
      return mutate(newCostCenter, {
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

  const loading = isSubmitting || isLoading || isUpdatingCostCenter

  return (
    <FormProvider formik={formik}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Nombre
            <Box component={'span'} color={'error.main'} ml={0.5}>
              *
            </Box>
          </Typography>

          <RFTextField
            inputProps={{ maxLength: '60' }}
            required
            name={'name'}
            size={'small'}
            disabled={loading}
            placeholder={'Nombre del Centro de Costos...'}
          />
        </Stack>

        <Stack>
          <FormControl disabled={loading}>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Seleccione al administrador del centro de costos:
            </FormLabel>
            <RadioGroup
              value={values.method}
              onChange={e => {
                !costCenter && setFieldValue('adminUsers', [])
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
                value={METHODS_NEW_COST_CENTER_USERS.ADMIN_USERS}
                control={<Radio />}
                label="Administrador de Centro de Costos Existente"
              />
              <FormControlLabel
                value={METHODS_NEW_COST_CENTER_USERS.NEW_ADMIN_USER}
                control={<Radio />}
                label="Nuevo Administrador de Centro de Costos"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
        {values.method === METHODS_NEW_COST_CENTER_USERS.ADMIN_USERS ? (
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
              options={adminUsers || []}
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
                placeholder={'Nombre Administrador del Centro de Costos...'}
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
                placeholder={'Apellidos del Administrador del Centro de Costos...'}
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

        <Stack sx={{ pt: 1 }}>
          <LoadingButton size={'large'} loading={loading} variant="contained" color="primary" fullWidth type="submit">
            {costCenter ? 'Actualizar' : 'Crear'}
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

SpeiNewCostCenterForm.propTypes = {
  adminUsers: PropTypes.array,
  costCenter: PropTypes.shape({
    adminUsers: PropTypes.array,
    id: PropTypes.any,
    name: PropTypes.string
  }),
  onSuccess: PropTypes.func
}

export default SpeiNewCostCenterForm
