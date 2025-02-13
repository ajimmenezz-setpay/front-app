import { lazy, useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { ALL_COMMERCE_CARDS_KEYS } from '../adapters'
import { CommerceCardsTable } from '../components/table/CommerceCardsTable'

import { useAssignUserCard, useCommerceCards } from '@/app/business/viabo-card/all-commerce-cards/store'
import { VIABO_CARD_PATHS, VIABO_CARD_ROUTES_NAMES } from '@/app/business/viabo-card/routes'
import { PATH_DASHBOARD } from '@/routes'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const AssignCardsDrawer = Lodable(lazy(() => import('../components/assign-card/AssignCardsDrawer')))
const AssignUserInfoDrawer = Lodable(lazy(() => import('../components/user-card/AssignUserInfoDrawer')))

export default function AllCommerceCards() {
  const { openAssign: openAssignCards, setOpenAssign } = useCommerceCards(state => state)
  const { openUserInfo, setOpenUserInfo } = useAssignUserCard(state => state)
  const queryClient = useQueryClient()

  const [resetSelection, setResetSelection] = useState(false)

  useEffect(
    () => () => {
      const keysArray = Object.values(ALL_COMMERCE_CARDS_KEYS)
      queryClient.cancelQueries({ queryKey: keysArray })
    },
    []
  )

  return (
    <Page title="Stock de Tarjetas del Comercio">
      <ContainerPage sx={{ height: '100%' }}>
        <HeaderPage
          name={'Stock de Tarjetas'}
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'Viabo Card', href: VIABO_CARD_PATHS.allCards },
            { name: VIABO_CARD_ROUTES_NAMES.allCards.name }
          ]}
        />
        <CommerceCardsTable setResetSelection={setResetSelection} resetSelection={resetSelection} />
        <AssignCardsDrawer
          open={openAssignCards}
          handleClose={() => {
            setOpenAssign(false)
          }}
          handleSuccess={() => {
            setOpenAssign(false)
            setResetSelection(true)
          }}
        />
        <AssignUserInfoDrawer
          open={openUserInfo}
          handleClose={() => {
            setOpenUserInfo(false)
          }}
          handleSuccess={() => {
            setOpenUserInfo(false)
          }}
        />
      </ContainerPage>
    </Page>
  )
}
