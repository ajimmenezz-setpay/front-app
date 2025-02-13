import { lazy, useEffect } from 'react'

import { ArrowBack } from '@mui/icons-material'
import { Button, Stack } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { useCardCloudBreadCrumbs, useFindCardByCompanySubAccount } from '../../shared/hooks'
import { CARD_CLOUD_PATHS } from '../../shared/routes/card-cloud-paths'
import { useCardCloudSharedStore } from '../../shared/store'
import { CARD_CLOUD_CARDS_KEYS } from '../adapters'
import { CardDetails } from '../components/card-details/CardDetails'
import { useCardsOfCardCloudStore } from '../store'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { useGetQueryState } from '@/shared/hooks'

const CardSecurityDetailsDrawer = Lodable(lazy(() => import('../components/card-details/CardSecurityDetailsDrawer')))
const TransferFromCardOfCardCloudDrawer = Lodable(
  lazy(() => import('../components/card-transfer/TransferFromCardOfCardCloudDrawer'))
)

export const CompanyCardOfCardCloud = () => {
  const { card } = useCardCloudBreadCrumbs()
  const { cardId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const subAccountId = searchParams.get('s')

  const setSelectedCard = useCardsOfCardCloudStore(state => state.setSelectedCard)
  const selectedCard = useCardsOfCardCloudStore(state => state.selectedCard)
  const setSelectedCompany = useCardCloudSharedStore(state => state.setSelectedCompany)
  const selectedCompany = useCardCloudSharedStore(state => state.selectedCompany)
  const cards = useCardsOfCardCloudStore(state => state.cards)
  const setCards = useCardsOfCardCloudStore(state => state.setCards)

  const hasNotCards = cards?.length === 0

  const cardsQuery = useFindCardByCompanySubAccount(subAccountId, {
    enabled: !!(hasNotCards && subAccountId)
  })
  const state = useGetQueryState([CARD_CLOUD_CARDS_KEYS.CARD, cardId])
  const isSuccessCardInfo = state?.status === 'success'

  useEffect(() => {
    const data = cardsQuery?.data

    if (data) {
      setCards(data)
      !selectedCard && setSelectedCard({ id: cardId })
    }
  }, [cardsQuery?.data])

  const isError = cardsQuery?.isError
  const error = cardsQuery?.error
  const loading = cardsQuery?.isLoading

  return (
    <Page title="Detalle Tarjeta - Card Cloud">
      <ContainerPage>
        <HeaderPage
          name={'Detalle Tarjeta'}
          links={card(cardId)}
          buttons={
            subAccountId && (
              <Button
                variant="outlined"
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  !selectedCompany?.id && setSelectedCompany(null)
                  navigate(CARD_CLOUD_PATHS.cards)
                }}
                startIcon={<ArrowBack />}
              >
                Regresar
              </Button>
            )
          }
        />

        {!subAccountId && (
          <ErrorRequestPage
            sx={{ justifyContent: 'flex-start' }}
            errorMessage={'No se encontro la subcuenta de la tarjeta solicitada'}
            errorTextButton={'Regresar a Lista de Tarjetas'}
            handleButton={() => {
              !selectedCompany?.id && setSelectedCompany(null)
              navigate(CARD_CLOUD_PATHS.cards)
            }}
          />
        )}
        {subAccountId && (
          <Stack flex={1} height={isSuccessCardInfo ? 1 : '100dvh'}>
            <CardDetails loading={loading} isError={isError} error={error} />
          </Stack>
        )}
      </ContainerPage>
      <CardSecurityDetailsDrawer />
      <TransferFromCardOfCardCloudDrawer />
    </Page>
  )
}
