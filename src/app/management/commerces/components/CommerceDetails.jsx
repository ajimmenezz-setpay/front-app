import { lazy, useEffect } from 'react'

import { Stack, Typography } from '@mui/material'

import { useFindCommerceDetails } from '../hooks'

import { useCommerce } from '@/app/management/commerces/store'
import { RightPanel } from '@/app/shared/components'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'

const GeneralInfoForm = Lodable(lazy(() => import('./details/GeneralInfoForm')))

function CommerceDetails() {
  const { setCommerce, setOpenCommerceDetails } = useCommerce(state => state)
  const openCommerceDetails = useCommerce(state => state.openCommerceDetails)
  const commerce = useCommerce(state => state.commerce)
  const {
    data: commerceDetails,
    isLoading,
    isError,
    error,
    refetch
  } = useFindCommerceDetails(commerce?.id, { enabled: !!commerce?.id })

  const handleClose = () => {
    setOpenCommerceDetails(false)
    setCommerce(null)
  }

  useEffect(() => {
    if (commerce?.id) {
      refetch()
    }
  }, [commerce])

  return (
    <RightPanel
      open={openCommerceDetails}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>Editar Comercio</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack p={3}>
          {isLoading && <RequestLoadingComponent />}
          {isError && !isLoading && (
            <ErrorRequestPage errorMessage={error} titleMessage={'Detalles Comercio'} handleButton={() => refetch()} />
          )}
          {openCommerceDetails && !isError && !isLoading && (
            <GeneralInfoForm commerce={commerceDetails} onSuccess={handleClose} />
          )}
        </Stack>
      </Scrollbar>
    </RightPanel>
  )
}

export default CommerceDetails
