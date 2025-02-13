import { useMemo } from 'react'

import PropTypes from 'prop-types'

import { LoadingButton } from '@mui/lab'
import { Box, Checkbox, FormControlLabel, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'

import { CommerceUpdateAdapter } from '@/app/business/commerce/adapters/commerceUpdateAdapter'
import { useUpdateCommerceProcess } from '@/app/business/commerce/hooks'
import { CARD_USES, PROCESS_LIST } from '@/app/business/commerce/services'
import { propTypesStore } from '@/app/business/commerce/store'
import { getCommerceValidationByService } from '@/app/business/commerce/validations/commerceInfoValidation'

CommerceInfo.propTypes = {
  store: PropTypes.shape(propTypesStore)
}

export default function CommerceInfo({ store }) {
  const { resume, setActualProcess, setLastProcess } = store
  const { schema, initialValues, allInfoIsRequired } = useMemo(() => getCommerceValidationByService(resume), [resume])

  const { mutate: updateInfoCommerce, isLoading: isUpdatingCommerce } = useUpdateCommerceProcess()

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: values => {
      const {
        fiscalName,
        rfc,
        commercialName,
        employeesNumber,
        branchesNumber,
        tpvsNumber,
        apiRequired,
        cardsUse,
        cardsNumber,
        customCardsRequired
      } = values
      const resumeAdapter = CommerceUpdateAdapter(resume, 3)
      const services = resumeAdapter?.services?.map(service => {
        if (service?.type === '2') {
          return {
            ...service,
            type: service.type.toString(),
            cardNumbers: cardsNumber.toString(),
            cardUse: cardsUse,
            personalized: customCardsRequired ? '1' : '0'
          }
        } else {
          return service
        }
      })
      const dataAdapted = {
        ...resumeAdapter,
        fiscalName,
        tradeName: commercialName,
        rfc,
        employees: employeesNumber,
        branchOffices: branchesNumber,
        pointSaleTerminal: tpvsNumber,
        paymentApi: apiRequired ? '1' : '0',
        services
      }

      updateInfoCommerce(dataAdapted, {
        onSuccess: () => {
          setActualProcess(PROCESS_LIST.COMMERCE_DOCUMENTATION)
          setLastProcess({ info: null, name: PROCESS_LIST.COMMERCE_INFO })
          setSubmitting(false)
        },
        onError: () => {
          setSubmitting(false)
        }
      })
    }
  })

  const { handleSubmit, values, errors, touched, handleChange, isSubmitting, setSubmitting, getFieldProps } = formik

  const loading = isSubmitting || isUpdatingCommerce

  return (
    <>
      <Stack direction="column" width={1} spacing={1}>
        <Typography variant="h4" color="textPrimary" align="center">
          Información del Comercio
        </Typography>
        <Typography paragraph align="center" variant="body1" color={'text.secondary'} whiteSpace="pre-line">
          Ingrese la información del comercio para continuar con el proceso
        </Typography>
      </Stack>
      <Box width={1} py={4} component={'form'} onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            name="fiscalName"
            label="Nombre Fiscal"
            autoFocus
            value={values.fiscalName}
            error={touched.fiscalName && Boolean(errors.fiscalName)}
            helperText={touched.fiscalName && errors.fiscalName}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            fullWidth
            name="rfc"
            label="RFC"
            value={values.rfc}
            error={touched.rfc && Boolean(errors.rfc)}
            helperText={touched.rfc && errors.rfc}
            onChange={handleChange}
            disabled={loading}
          />

          <TextField
            fullWidth
            name="commercialName"
            label="Nombre Comercial"
            value={values.commercialName}
            error={touched.commercialName && Boolean(errors.commercialName)}
            helperText={touched.commercialName && errors.commercialName}
            onChange={handleChange}
            disabled={loading}
          />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField
              fullWidth
              name="employeesNumber"
              label="No. Empleados"
              type={'number'}
              inputProps={{ inputMode: 'numeric', min: '1' }}
              value={values.employeesNumber}
              error={touched.employeesNumber && Boolean(errors.employeesNumber)}
              helperText={touched.employeesNumber && errors.employeesNumber}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              fullWidth
              name="branchesNumber"
              label="No. Sucursales"
              type={'number'}
              inputProps={{ inputMode: 'numeric', min: '1' }}
              value={values.branchesNumber}
              error={touched.branchesNumber && Boolean(errors.branchesNumber)}
              helperText={touched.branchesNumber && errors.branchesNumber}
              onChange={handleChange}
              disabled={loading}
            />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <TextField
              fullWidth
              name="tpvsNumber"
              label="No. Terminales TPV's"
              type={'number'}
              inputProps={{ inputMode: 'numeric', min: '1' }}
              value={values.tpvsNumber}
              error={touched.tpvsNumber && Boolean(errors.tpvsNumber)}
              helperText={touched.tpvsNumber && errors.tpvsNumber}
              onChange={handleChange}
              disabled={loading}
            />
            {allInfoIsRequired && (
              <TextField
                fullWidth
                name="cardsNumber"
                label="No. de Tarjetas"
                type={'number'}
                inputProps={{ inputMode: 'numeric', min: '1' }}
                value={values.cardsNumber}
                error={touched.cardsNumber && Boolean(errors.cardsNumber)}
                helperText={touched.cardsNumber && errors.cardsNumber}
                onChange={handleChange}
                disabled={loading}
              />
            )}
          </Stack>

          {allInfoIsRequired && (
            <TextField
              {...getFieldProps('cardsUse')}
              value={values?.cardsUse}
              disabled={isSubmitting}
              fullWidth
              select
              label="Uso de las tarjetas"
              placeholder="Seleccionar"
              SelectProps={{
                MenuProps: {
                  sx: { '& .MuiPaper-root': { maxHeight: 260 } }
                }
              }}
              error={touched.cardsUse && Boolean(errors.cardsUse)}
              helperText={touched.cardsUse && errors.cardsUse}
              sx={{
                textTransform: 'capitalize'
              }}
            >
              {CARD_USES.map(option => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'uppercase'
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}

          <FormControlLabel
            control={
              <Checkbox
                {...getFieldProps('apiRequired')}
                disabled={loading}
                checked={values?.apiRequired}
                value={values?.apiRequired}
              />
            }
            label="¿Se requiere API para ligas de cobro? (Pagos a distancia sin tarjeta física, protegido con 3D secure)"
          />

          {allInfoIsRequired && (
            <FormControlLabel
              control={
                <Checkbox
                  {...getFieldProps('customCardsRequired')}
                  disabled={loading}
                  checked={values?.customCardsRequired}
                  value={values?.customCardsRequired}
                />
              }
              label="¿Desea que las tarjetas fisicas esten personalizadas? (Grabadas)"
            />
          )}

          <LoadingButton
            loading={loading}
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ textTransform: 'uppercase' }}
          >
            Guardar
          </LoadingButton>
        </Stack>
      </Box>
    </>
  )
}
