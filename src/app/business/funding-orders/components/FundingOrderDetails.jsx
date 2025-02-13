import { useEffect } from 'react'

import { Stack, Typography } from '@mui/material'

import { ConciliateFundingOrderInfo, GeneralInfoFundingOrder, PaymentFundingOrderInfo } from './details'

import { useFindFundingOrderDetails } from '../hooks/useFindFundingOrderDetails'
import { useFundingOrderStore } from '../store'

import { RightPanel } from '@/app/shared/components'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'

const FundingOrderDetails = () => {
  const fundingOrder = useFundingOrderStore(state => state.fundingOrder)
  const setFundingOrder = useFundingOrderStore(state => state.setFundingOrder)
  const setOpenDetailsFundingOrder = useFundingOrderStore(state => state.setOpenDetailsFundingOrder)
  const openDetailsFundingOrder = useFundingOrderStore(state => state.openDetailsFundingOrder)

  const {
    data: fundingOrderDetails,
    isLoading,
    isError,
    error,
    refetch
  } = useFindFundingOrderDetails(fundingOrder, { enabled: !!fundingOrder })

  useEffect(() => {
    if (fundingOrder) {
      refetch()
    }
  }, [fundingOrder])

  const handleClose = () => {
    setOpenDetailsFundingOrder(false)
    setFundingOrder(null)
  }
  return (
    <RightPanel
      open={openDetailsFundingOrder}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>Orden de Fondeo</Typography>
          <Typography variant={'subtitle1'}>#{fundingOrder?.referenceNumber}</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack spacing={3} p={3}>
          {isLoading && <RequestLoadingComponent />}
          {isError && !isLoading && (
            <ErrorRequestPage
              errorMessage={error}
              titleMessage={'Detalles Orden de Fondeo'}
              handleButton={() => refetch()}
            />
          )}
          {!isError && !isLoading && (
            <>
              <GeneralInfoFundingOrder fundingOrder={fundingOrderDetails} />
              {['Pagada', 'Liquidada'].includes(fundingOrder?.status) && fundingOrder?.payCash !== '' && (
                <PaymentFundingOrderInfo fundingOrder={fundingOrderDetails} />
              )}
              <ConciliateFundingOrderInfo fundingOrder={fundingOrderDetails} />
            </>
          )}
        </Stack>
      </Scrollbar>
    </RightPanel>
  )
}

export default FundingOrderDetails
