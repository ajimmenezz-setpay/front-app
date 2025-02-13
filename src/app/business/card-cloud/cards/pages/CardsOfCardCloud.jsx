import { lazy, Suspense, useEffect, useState } from 'react'

import { Box } from '@mui/material'

import {
  useCardCloudBreadCrumbs,
  useFindCardByCompanySubAccount,
  useFindCardCloudCompanies,
  useFindCardCloudSubAccountInfo
} from '../../shared/hooks'
import { useCardCloudSharedStore } from '../../shared/store'
import { CardDetails } from '../components/card-details/CardDetails'
import { CardListDrawer } from '../components/card-list'
import { CardsCompanyListTable } from '../components/card-list/table/CardsCompanyListTable'
import { useCardsOfCardCloudStore } from '../store'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const CardsHeaderOfCardCloud = lazy(() => import('../components/CardsHeaderOfCardCloud'))
const CardSecurityDetailsDrawer = Lodable(lazy(() => import('../components/card-details/CardSecurityDetailsDrawer')))
const TransferFromCardOfCardCloudDrawer = Lodable(
  lazy(() => import('../components/card-transfer/TransferFromCardOfCardCloudDrawer'))
)
const CardsAssignDrawerOfCardCloud = Lodable(
  lazy(() => import('../components/cards-assign/CardsAssignDrawerOfCardCloud'))
)

const TransferSubAccountsCardCloudDrawer = Lodable(
  lazy(() => import('../../shared/components/TransferSubAccountsCardCloudDrawer'))
)

export const CardsOfCardCloud = () => {
  const { cards } = useCardCloudBreadCrumbs()
  const { setSelectedCard, setSelectedCards, setCards } = useCardsOfCardCloudStore()
  const { selectedCard, setIsListView } = useCardsOfCardCloudStore()
  const { setSelectedCompany, setCompanySubAccountInfo } = useCardCloudSharedStore()
  const { selectedCompany } = useCardCloudSharedStore()

  const { isLoading, data } = useFindCardCloudCompanies()

  const cardsQuery = useFindCardByCompanySubAccount(selectedCompany?.subAccountId, {
    enabled: !!selectedCompany?.subAccountId
  })

  const queryCardCloudSubAccountInfo = useFindCardCloudSubAccountInfo(selectedCompany?.subAccountId, {
    enabled: false
  })

  useEffect(() => {
    if (queryCardCloudSubAccountInfo?.data) {
      setCompanySubAccountInfo(queryCardCloudSubAccountInfo?.data)
    } else {
      setCompanySubAccountInfo(null)
    }
  }, [queryCardCloudSubAccountInfo?.data])

  useEffect(() => {
    if (data && data.length >= 1 && !selectedCompany) {
      setSelectedCompany(data?.[0])
    }
  }, [data])

  useEffect(() => {
    if (selectedCompany?.subAccountId) {
      cardsQuery?.refetch()
      queryCardCloudSubAccountInfo?.refetch()
    }
  }, [selectedCompany?.subAccountId])

  useEffect(() => {
    const data = cardsQuery?.data
    if (data && data.length >= 1 && !selectedCard) {
      setSelectedCard(data?.[0])
    }
    if (data) {
      setCards(data)
    }
  }, [cardsQuery?.data])

  const loading = cardsQuery?.isLoading || isLoading || queryCardCloudSubAccountInfo?.isLoading

  const [view, setView] = useState('list')

  const handleChangeView = (event, newValue) => {
    if (newValue) {
      setView(newValue)
    }
    if (newValue === 'list') {
      setIsListView(true)
    } else {
      setSelectedCards([])
      setIsListView(false)
    }
  }

  return (
    <Page title="Tarjetas Empresa - Card Cloud">
      <ContainerPage sx={{ pb: view === 'list' ? 3 : 0 }}>
        {view === 'list' && (
          <>
            <HeaderPage
              name={'Tarjetas Empresa'}
              links={cards}
              buttons={
                <Suspense fallback={null}>
                  <CardsHeaderOfCardCloud
                    cardsQuery={cardsQuery}
                    loading={loading}
                    companies={data}
                    view={view}
                    handleChangeView={handleChangeView}
                  />
                </Suspense>
              }
            />
            <CardsCompanyListTable cardsQuery={{ ...cardsQuery, isLoading: loading }} />
          </>
        )}

        {view === 'details' && (
          <Box
            display={'flex'}
            overflow={'hidden'}
            sx={{ height: '100vH', maxHeight: '100%', flexDirection: 'column' }}
          >
            <Box>
              <HeaderPage
                name={'Tarjetas Empresa'}
                links={cards}
                buttons={
                  <Suspense fallback={null}>
                    <CardsHeaderOfCardCloud
                      cardsQuery={cardsQuery}
                      loading={loading}
                      companies={data}
                      view={view}
                      handleChangeView={handleChangeView}
                    />
                  </Suspense>
                }
              />
            </Box>
            <Box display={'flex'} overflow={'hidden'} flex={1}>
              <CardListDrawer cardsQuery={{ ...cardsQuery, isLoading: loading }} />
              <CardDetails />
            </Box>
          </Box>
        )}
      </ContainerPage>
      <CardSecurityDetailsDrawer />
      <TransferFromCardOfCardCloudDrawer />
      <CardsAssignDrawerOfCardCloud cardsQuery={cardsQuery} />
      <TransferSubAccountsCardCloudDrawer />
    </Page>
  )
}
