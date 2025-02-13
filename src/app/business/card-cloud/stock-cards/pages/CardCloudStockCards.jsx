import { lazy } from 'react'

import { useCardCloudBreadCrumbs } from '../../shared/hooks'
import { CardCloudStockCardsList } from '../components/CardCloudStockCardsList'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const CardCloudAssignCardsDrawer = Lodable(lazy(() => import('../components/CardCloudAssignCardsDrawer')))

export const CardCloudStockCards = () => {
  const { stockCards } = useCardCloudBreadCrumbs()
  return (
    <Page title="Stock de Tarjetas - Card Cloud">
      <ContainerPage sx={{ pb: 3 }}>
        <HeaderPage name={'Stock de Tarjetas'} links={stockCards} />
        <CardCloudStockCardsList />
      </ContainerPage>
      <CardCloudAssignCardsDrawer />
    </Page>
  )
}
