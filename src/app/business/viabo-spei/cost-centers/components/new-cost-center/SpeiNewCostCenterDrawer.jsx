import { lazy, useEffect } from 'react'

import { Stack, Typography } from '@mui/material'

import { useFindSpeiAdminCostCenterUsers } from '../../hooks'
import { useSpeiCostCentersStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'

const SpeiNewCostCenterForm = Lodable(lazy(() => import('./SpeiNewCostCenterForm')))

const SpeiNewCostCenterDrawer = () => {
  const { openNewCostCenter, setOpenNewSpeiCostCenter, setSpeiCostCenter } = useSpeiCostCentersStore()
  const costCenter = useSpeiCostCentersStore(state => state.costCenter)

  const { data: users, isLoading, isError, error, refetch } = useFindSpeiAdminCostCenterUsers({ enabled: false })

  useEffect(() => {
    if (openNewCostCenter) {
      refetch()
    }
  }, [openNewCostCenter])

  const handleClose = () => {
    setOpenNewSpeiCostCenter(false)
    setSpeiCostCenter(null)
  }

  return (
    <RightPanel
      open={openNewCostCenter}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>{costCenter ? 'Editar Centro de Costos' : 'Nuevo Centro de Costos'}</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack spacing={3} p={3}>
          {isLoading && <RequestLoadingComponent />}
          {isError && !isLoading && (
            <ErrorRequestPage errorMessage={error} titleMessage={'Lista de Usuarios'} handleButton={() => refetch()} />
          )}
          {!isError && !isLoading && openNewCostCenter && (
            <SpeiNewCostCenterForm adminUsers={users} onSuccess={handleClose} costCenter={costCenter} />
          )}
        </Stack>
      </Scrollbar>
    </RightPanel>
  )
}

export default SpeiNewCostCenterDrawer
