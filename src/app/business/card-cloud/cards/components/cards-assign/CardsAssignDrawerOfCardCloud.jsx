import { lazy, useEffect, useMemo } from 'react'

import { Typography } from '@mui/material'

import { useFindCardHoldersByCompany, useQueryStateCardCloudShared } from '../../../shared/hooks'
import { useCardCloudSharedStore } from '../../../shared/store'
import { useCardsOfCardCloudStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'

const CardsAssignFormOfCardCloud = Lodable(lazy(() => import('./CardsAssignFormOfCardCloud')))

const CardsAssignDrawerOfCardCloud = ({ cardsQuery }) => {
  const open = useCardsOfCardCloudStore(state => state.openAssignCards)
  const setOpenAssignCards = useCardsOfCardCloudStore(state => state.setOpenAssignCards)
  const selectedCompany = useCardCloudSharedStore(state => state.selectedCompany)
  const selectedCards = useCardsOfCardCloudStore(state => state.selectedCards)
  const { isFetchingCardsCompanyBySubAccount } = useQueryStateCardCloudShared()
  const isFetching = !!isFetchingCardsCompanyBySubAccount(selectedCompany?.subAccountId)

  const {
    data: cardHolders,
    isFetching: isLoadingCardHolders,
    isError: isErrorCardHolders,
    error: errorCardHolders,
    refetch
  } = useFindCardHoldersByCompany(selectedCompany?.id, { enabled: false })

  const availableCards = useMemo(
    () => cardsQuery?.data?.filter(card => card?.isAssigned === false) ?? [],
    [cardsQuery?.data]
  )

  const isLoading = isLoadingCardHolders || isFetching
  const isError = isErrorCardHolders
  const error = errorCardHolders

  const handleClose = () => {
    setOpenAssignCards(false)
  }

  useEffect(() => {
    if (selectedCompany?.id && open) {
      refetch()
    }
  }, [selectedCompany?.id, open])

  return (
    <RightPanel
      open={Boolean(open)}
      handleClose={handleClose}
      titleElement={<Typography variant="h6">Asignar Tarjetas</Typography>}
    >
      {isLoading && <RequestLoadingComponent sx={{ p: 4 }} />}

      {isError && !isLoading && (
        <ErrorRequestPage
          sx={{ p: 4 }}
          errorMessage={error}
          titleMessage={'Usuarios Tarjetahabientes'}
          handleButton={refetch}
        />
      )}
      {!isLoading && !isError && (
        <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
          <CardsAssignFormOfCardCloud
            cardHolders={cardHolders}
            cards={availableCards}
            company={selectedCompany}
            onSuccess={handleClose}
            initialCards={selectedCards}
          />
        </Scrollbar>
      )}
    </RightPanel>
  )
}

export default CardsAssignDrawerOfCardCloud
