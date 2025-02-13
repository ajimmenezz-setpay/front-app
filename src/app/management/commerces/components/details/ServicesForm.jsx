import { useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { Box, Divider, Stack } from '@mui/material'
import { useFormik } from 'formik'

import { useUpdateCommerceService } from '../../hooks'

import { getOperationTypeByName } from '@/app/shared/services'
import { FormProvider, IOSSwitch } from '@/shared/components/form'
import { CircularLoading } from '@/shared/components/loadings'

const servicesCatalog = [
  {
    name: 'VIABO CARD',
    type: '2',
    formikValue: 'viaboCard'
  },
  {
    name: 'VIABO PAY',
    type: '1',
    formikValue: 'viaboPay'
  },
  {
    name: 'NUBE',
    type: '3',
    formikValue: 'cloud'
  }
]

const ServicesForm = ({ commerce }) => {
  const { mutate, isLoading } = useUpdateCommerceService()
  const [loadingType, setLoadingType] = useState(null)
  const commerceServices = commerce?.services?.catalog

  const services = useMemo(
    () =>
      servicesCatalog?.map(service => {
        const serviceLogo = getOperationTypeByName(service?.name)
        return {
          ...service,
          logo: serviceLogo?.component
        }
      }),
    [servicesCatalog]
  )

  const formik = useFormik({
    initialValues: {
      viaboPay: commerceServices?.some(service => service?.type === '1') || false,
      viaboCard: commerceServices?.some(service => service?.type === '2') || false,
      cloud: commerceServices?.some(service => service?.type === '3') || false
    },
    enableReinitialize: true
  })

  const { values, setFieldValue } = formik

  const handleChange = service => event => {
    setLoadingType(service?.type)
    const active = !values[service?.formikValue]
    mutate(
      { commerceId: commerce?.id, type: service?.type, active: active ? '1' : '0' },
      {
        onSuccess: () => {
          setFieldValue(service?.formikValue, active)
          setLoadingType(null)
        },
        onError: () => {
          setLoadingType(null)
        }
      }
    )
  }

  return (
    <FormProvider formik={formik}>
      <Stack spacing={2} p={5} divider={<Divider orientation="horizontal" flexItem sx={{ borderStyle: 'dashed' }} />}>
        {services?.map(service => {
          const Logo = service.logo
          return (
            <Stack justifyContent={'space-between'} flexDirection={'row'} key={service?.name} alignItems={'center'}>
              {Logo && (
                <Box py={1}>
                  <Logo sx={{ width: 35, height: 35 }} />
                </Box>
              )}
              {loadingType === service?.type ? (
                <CircularLoading
                  size={30}
                  containerProps={{
                    display: 'flex',
                    ml: 1
                  }}
                />
              ) : (
                <IOSSwitch
                  disabled={isLoading}
                  size="md"
                  color={!values[service?.formikValue] ? 'error' : 'success'}
                  checked={Boolean(values[service?.formikValue]) || false}
                  inputProps={{ 'aria-label': 'controlled' }}
                  onChange={handleChange(service)}
                />
              )}
            </Stack>
          )
        })}
      </Stack>
    </FormProvider>
  )
}

ServicesForm.propTypes = {
  commerce: PropTypes.shape({
    id: PropTypes.any,
    services: PropTypes.shape({
      catalog: PropTypes.array
    })
  })
}

export default ServicesForm
