import { lazy, useEffect } from 'react'

import { Stack, Typography } from '@mui/material'

import { useFindSpeiCostCenters } from '../../../cost-centers/hooks'
import {
  useFindConcentratorsList,
  useFindSpeiAdminCompanyUsers,
  useFindSpeiCommissions,
  useFindSpeiCompanyDetails
} from '../../hooks'
import { useSpeiCompaniesStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'

const SpeiNewCompanyForm = Lodable(lazy(() => import('./SpeiNewCompanyForm')))

const SpeiNewCompanyDrawer = () => {
  const { openNewCompany, setOpenNewSpeiCompany, setSpeiCompany } = useSpeiCompaniesStore()
  const company = useSpeiCompaniesStore(state => state.company)

  const {
    data: users,
    isFetching: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
    refetch
  } = useFindSpeiAdminCompanyUsers({ enabled: false })

  const {
    data: costCenters,
    isFetching: isLoadingCostCenters,
    isError: isErrorCostCenters,
    error: errorCostCenters,
    refetch: refetchCostCenters
  } = useFindSpeiCostCenters({ enabled: false })

  const {
    data: companyDetails,
    isError: isErrorDetails,
    error: errorDetails,
    isFetching: loadingDetails
  } = useFindSpeiCompanyDetails(company?.id, { enabled: !!company?.id })

  const {
    data: concentrators,
    isError: isErrorConcentrators,
    error: errorConcentrators,
    isLoading: loadingConcentrators
  } = useFindConcentratorsList({ enabled: !!openNewCompany })

  const { data: commissions, isLoading: loadingCommissions } = useFindSpeiCommissions({ enabled: !!openNewCompany })

  useEffect(() => {
    if (openNewCompany) {
      refetch()
      refetchCostCenters()
    }
  }, [openNewCompany])

  const handleClose = () => {
    setOpenNewSpeiCompany(false)
    setSpeiCompany(null)
  }

  const isError = isErrorUsers || isErrorCostCenters || isErrorDetails || isErrorConcentrators
  const isLoading =
    isLoadingUsers || isLoadingCostCenters || loadingDetails || loadingConcentrators || loadingCommissions
  const error = errorUsers || errorCostCenters || errorDetails || errorConcentrators

  return (
    <RightPanel
      open={openNewCompany}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>{company ? 'Editar Empresa' : 'Nueva Empresa'}</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack spacing={3} p={3}>
          {isLoading && <RequestLoadingComponent />}
          {isError && !isLoading && (
            <ErrorRequestPage
              errorMessage={error}
              titleMessage={'Error al obtener información'}
              handleButton={() => refetch()}
            />
          )}
          {!isError && !isLoading && openNewCompany && (
            <SpeiNewCompanyForm
              adminCompanyUsers={users}
              costCenters={costCenters}
              concentrators={concentrators}
              company={companyDetails}
              commissions={commissions}
              onSuccess={handleClose}
            />
          )}
        </Stack>
      </Scrollbar>
    </RightPanel>
  )
}

export default SpeiNewCompanyDrawer
