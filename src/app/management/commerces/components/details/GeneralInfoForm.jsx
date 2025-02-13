import PropTypes from 'prop-types'

import { LoadingButton } from '@mui/lab'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ManagementCommerceInformationAdapter } from '../../adapters'
import { useUpdateCommerceInfo } from '../../hooks'

import { FormProvider, RFSelect, RFTextField, RFUploadSingleFile } from '@/shared/components/form'

function GeneralInfoForm({ commerce, onSuccess }) {
  const { mutate, isLoading } = useUpdateCommerceInfo()

  const CommerceSchema = Yup.object().shape({
    commercialName: Yup.string().trim().required('El nombre comercial es requerido'),
    employeesNumber: Yup.number().min(1, 'Al menos debe existir un empleado'),
    branchesNumber: Yup.number().min(1, 'Al menos debe existir una sucursal'),
    terminalCommerceSlug: Yup.string()
      .trim()
      .matches(/^[a-zA-Z]+([_-][a-zA-Z]+)*$/, {
        message: 'Solo se permiten letras y los espacios se deben convertir en (_ ó -).',
        excludeEmptyString: true
      })
  })

  const formik = useFormik({
    initialValues: {
      commercialName: commerce?.information?.commercialName || '',
      fiscalName: commerce?.information?.fiscalName || '',
      fiscalTypePerson: commerce?.information?.fiscalTypePerson || '1',
      rfc: commerce?.information?.rfc || '',
      employeesNumber: commerce?.information?.employeesNumber || '',
      branchesNumber: commerce?.information?.branchesNumber || '',
      postalAddress: commerce?.information?.postalAddress || '',
      phoneNumbers: commerce?.information?.phoneNumbers || '',
      terminalCommerceSlug: commerce?.information?.terminalCommerceSlug || '',
      publicTerminal:
        commerce?.terminals?.find(terminal => terminal?.id === commerce?.information?.publicTerminal) || null,
      commerceLogo: commerce?.information?.logo || null
    },
    enableReinitialize: true,
    validationSchema: CommerceSchema,
    onSubmit: (values, { setSubmitting, setFieldTouched }) => {
      const data = ManagementCommerceInformationAdapter(values, commerce)
      mutate(data, {
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

  const { isSubmitting, setFieldValue, values } = formik

  const loading = isSubmitting || isLoading

  return (
    <FormProvider formik={formik}>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Nombre Comercial *
          </Typography>

          <RFTextField
            size={'small'}
            name={'commercialName'}
            disabled={loading}
            required
            placeholder={'Comercio ...'}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Nombre Fiscal
          </Typography>

          <RFTextField
            size={'small'}
            name={'fiscalName'}
            disabled={loading}
            placeholder={'Comercio S.A. de C.V. ...'}
          />
        </Stack>

        <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          <Stack spacing={1} flex={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              RFC
            </Typography>

            <RFTextField size={'small'} name={'rfc'} disabled={loading} placeholder={'XXXXXXXXX ...'} />
          </Stack>

          <Stack flex={1}>
            <FormControl disabled={loading}>
              <FormLabel id="fiscal-type-person-group-label" sx={{ color: 'text.disabled', typography: 'overline' }}>
                Tipo de Persona
              </FormLabel>
              <RadioGroup
                value={values.fiscalTypePerson}
                onChange={e => {
                  setFieldValue('fiscalTypePerson', e.target.value)
                }}
                row
                aria-labelledby="fiscal-type-person-group-label"
                name="fiscalTypePerson"
              >
                <FormControlLabel value="1" control={<Radio />} label="Moral" />
                <FormControlLabel value="2" control={<Radio />} label="Física" />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Stack spacing={1} flex={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Número de empleados
            </Typography>

            <RFTextField
              size={'small'}
              name={'employeesNumber'}
              type={'number'}
              inputProps={{ inputMode: 'numeric', min: '1' }}
              disabled={loading}
              placeholder={'0'}
            />
          </Stack>

          <Stack spacing={1} flex={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Número de sucursales
            </Typography>

            <RFTextField
              size={'small'}
              name={'branchesNumber'}
              disabled={loading}
              placeholder={'0'}
              type={'number'}
              inputProps={{ inputMode: 'numeric', min: '1' }}
            />
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Dirección Postal
          </Typography>

          <RFTextField
            size={'small'}
            name={'postalAddress'}
            multiline
            disabled={loading}
            rows={2}
            placeholder={'...'}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Números Telefónicos
          </Typography>

          <RFTextField
            size={'small'}
            name={'phoneNumbers'}
            disabled={loading}
            placeholder={'(00)-0000 000... , (00) 0000 000...'}
          />
        </Stack>

        <Stack flex={1} spacing={1}>
          <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Terminal Cobro Pública *
          </Typography>
          <RFSelect
            size={'small'}
            name={'publicTerminal'}
            disabled={loading}
            options={commerce?.terminals || []}
            textFieldParams={{
              placeholder: 'Seleccionar ...',
              size: 'small'
            }}
          />
        </Stack>
        {commerce?.terminals?.length > 0 && (
          <Stack spacing={1}>
            <Typography m={0} paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Liga de cobro (Slug)
            </Typography>

            <RFTextField
              size={'small'}
              name={'terminalCommerceSlug'}
              disabled={loading}
              placeholder={'mi_comercio ...'}
            />
          </Stack>
        )}

        <Stack spacing={1}>
          <Typography variant="overline" sx={{ color: 'text.disabled', width: 1 }}>
            Logo (Max - 3MB - png,svg,webp):
          </Typography>

          <RFUploadSingleFile
            name={'commerceLogo'}
            maxSize={3145728}
            accept={{
              'image/*': ['.svg', '.webp', '.png']
            }}
          />
        </Stack>

        <Stack pt={2}>
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ fontWeight: 'bold' }}
          >
            Guardar
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  )
}

GeneralInfoForm.propTypes = {
  commerce: PropTypes.shape({
    information: PropTypes.shape({
      branchesNumber: PropTypes.string,
      logo: PropTypes.any,
      commercialName: PropTypes.string,
      employeesNumber: PropTypes.string,
      fiscalName: PropTypes.string,
      fiscalTypePerson: PropTypes.string,
      phoneNumbers: PropTypes.string,
      postalAddress: PropTypes.string,
      publicTerminal: PropTypes.any,
      rfc: PropTypes.string,
      terminalCommerceSlug: PropTypes.string
    }),
    terminals: PropTypes.array
  }),
  onSuccess: PropTypes.func
}

export default GeneralInfoForm
