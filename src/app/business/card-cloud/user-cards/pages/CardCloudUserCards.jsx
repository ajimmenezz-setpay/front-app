import { lazy, useEffect } from 'react'

import { AddCard, PaidOutlined, Refresh } from '@mui/icons-material'
import { Box, Button, Card, Grid, IconButton, LinearProgress, Stack } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

import { CARD_CLOUD_CARDS_KEYS } from '../../cards/adapters'
import { CardMovementsOfCardCloud } from '../../cards/components/card-movements/CardMovementsOfCardCloud'
import { useCardsOfCardCloudStore } from '../../cards/store'
import { CardCloudMovementsAdapter } from '../../shared/adapters'
import { useCardCloudSharedStore } from '../../shared/store'
import { CARD_CLOUD_USER_CARDS_KEYS } from '../adapters'
import CardCloudAddCardToCardHolderDrawer from '../components/add-new-card/CardCloudAddCardToCardHolderDrawer'
import { CardCloudCardList } from '../components/CardCloudCardList'
import { CardCloudUserCardActions } from '../components/CardCloudUserCardActions'
import { useFindCardCloudUserCards } from '../hooks'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'
import { EmptyList } from '@/shared/components/notifications'
import { fCurrency } from '@/shared/utils'

const CardSecurityDetailsDrawer = Lodable(
  lazy(() => import('../../cards/components/card-details/CardSecurityDetailsDrawer'))
)

const CardSecurityNIPDrawer = Lodable(lazy(() => import('../../cards/components/card-details/CardSecurityNIPDrawer')))

const CardCloudTransferBetweenCardsDrawer = Lodable(
  lazy(() => import('../../cards/components/card-transfer/CardCloudTransferBetweenCardsDrawer'))
)

const CardCloudBuyVirtualCardDrawer = Lodable(
  lazy(() => import('../components/buy-virtual-card/CardCloudBuyVirtualCardDrawer'))
)

export const CardCloudUserCards = () => {
  const queryCards = useFindCardCloudUserCards()
  const client = useQueryClient()

  const { setSelectedCard, setCards, setOpenAddNewCard, setOpenBuyVirtualCard } = useCardsOfCardCloudStore()
  const { selectedCard } = useCardsOfCardCloudStore()
  const filterKeyMovements = useCardsOfCardCloudStore(state => state.filterKeyMovements)
  const setSelectedCompany = useCardCloudSharedStore(state => state.setSelectedCompany)

  useEffect(() => {
    if (queryCards?.data?.length >= 1 && !selectedCard) {
      setSelectedCard(queryCards?.data[0])
      setSelectedCompany(queryCards?.data[0]?.company)
    }
    if (queryCards?.data) {
      setCards(queryCards?.data)
    }
    const findSelectedCard = queryCards?.data?.find(card => card?.id === selectedCard?.id)
    if (findSelectedCard) {
      setSelectedCard(findSelectedCard)
    }
  }, [queryCards?.data])

  const updateCardBalance = data => {
    const newBalance = data?.new_balance || data?.balance?.number?.toString()
    if (newBalance) {
      const balance = parseFloat(newBalance || 0) ?? 0

      setSelectedCard({
        ...selectedCard,
        balance: {
          number: balance,
          format: fCurrency(balance)
        }
      })

      client.invalidateQueries({ queryKey: [CARD_CLOUD_USER_CARDS_KEYS.CARDS] })
    }
  }

  const updateMovements = data => {
    if (data?.movement) {
      client.setQueryData([CARD_CLOUD_CARDS_KEYS.CARD_MOVEMENTS, selectedCard?.id, filterKeyMovements], oldData => {
        const movements = oldData?.original || []
        const newMovements = [...movements, data?.movement?.original]
        const movementsAdapted = CardCloudMovementsAdapter(newMovements)
        return movementsAdapted
      })
    }
  }

  const handleBuyVirtualCardSuccess = data => {
    client.invalidateQueries({ queryKey: [CARD_CLOUD_CARDS_KEYS.CARD_MOVEMENTS, selectedCard?.id, filterKeyMovements] })
  }

  return (
    <Page title="Tarjetas Tarjetahabiente - Card Cloud">
      <ContainerPage sx={{ pb: 3 }}>
        <HeaderPage
          name={'Tarjetas'}
          buttons={
            <Stack gap={2} flexDirection={{ xs: 'column-reverse', sm: 'row' }} alignItems={{ sm: 'center' }}>
              {queryCards?.data?.length > 0 ? (
                <Button
                  disabled={!selectedCard?.id || queryCards?.isFetching}
                  startIcon={<PaidOutlined />}
                  variant="outlined"
                  onClick={() => setOpenBuyVirtualCard(true)}
                >
                  Comprar Tarjeta Virtual
                </Button>
              ) : null}
              <Button variant="contained" startIcon={<AddCard />} onClick={() => setOpenAddNewCard(true)}>
                Agregar Tarjeta
              </Button>
            </Stack>
          }
        />
        {queryCards?.data?.length === 0 && !queryCards?.isLoading && (
          <EmptyList message={'No hay tarjetas asignadas para este usuario'} />
        )}
        {(queryCards?.data?.length > 0 || queryCards?.isLoading) && (
          <Stack gap={3}>
            <Card variant="outlined" position="relative">
              {queryCards?.isFetching && (
                <Box position={'absolute'} top={0} width={1}>
                  <LinearProgress />
                </Box>
              )}

              <Box
                position={'absolute'}
                display="flex"
                right={{ xs: 5, md: 10 }}
                top={{ xs: 5, md: 10 }}
                flexDirection={{ xs: 'row', sm: 'row' }}
              >
                <IconButton
                  size="small"
                  onClick={queryCards.refetch}
                  sx={{ color: 'text.primary' }}
                  disabled={queryCards.isFetching}
                  aria-haspopup="true"
                  title="Actualizar Lista de Tarjetas"
                >
                  <Refresh width={20} height={20} />
                </IconButton>
              </Box>
              <Grid container spacing={4} p={4}>
                <Grid item xs={12} md={6} lg={6} xl={5}>
                  <CardCloudCardList queryCards={queryCards} />
                </Grid>

                <Grid item xs={12} md={6} lg={6} xl={7}>
                  <CardCloudUserCardActions />
                </Grid>
              </Grid>
              {queryCards?.isFetching && (
                <Box position={'absolute'} bottom={0} width={1}>
                  <LinearProgress />
                </Box>
              )}
            </Card>
            {selectedCard && (
              <Card sx={{ p: 0, pb: 3 }} variant="outlined">
                <CardMovementsOfCardCloud headerProps={{ px: 3, pt: 3 }} />
              </Card>
            )}
          </Stack>
        )}

        <CardSecurityDetailsDrawer />
        <CardSecurityNIPDrawer />
        <CardCloudTransferBetweenCardsDrawer
          onSuccess={data => {
            updateCardBalance(data)
            updateMovements(data)
          }}
        />
        <CardCloudAddCardToCardHolderDrawer />
        <CardCloudBuyVirtualCardDrawer cards={queryCards?.data || []} onSuccess={handleBuyVirtualCardSuccess} />
      </ContainerPage>
    </Page>
  )
}
