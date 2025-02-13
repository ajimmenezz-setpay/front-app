import { lazy } from 'react'

import { FundingOrdersTable } from '../components'
import { useFundingOrderStore } from '../store'

import { PATH_DASHBOARD } from '@/routes'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const ConciliateModal = Lodable(lazy(() => import('../components/ConciliateModal')))
const CancelFundingOrder = Lodable(lazy(() => import('../components/CancelFundingOrder')))
const FundingOrderDetails = Lodable(lazy(() => import('../components/FundingOrderDetails')))

const FundingOrders = () => {
  const openConciliateModal = useFundingOrderStore(state => state.openConciliateModal)
  const openCancelFundingOrder = useFundingOrderStore(state => state.openCancelFundingOrder)
  const openDetailsFundingOrder = useFundingOrderStore(state => state.openDetailsFundingOrder)

  return (
    <Page title="Órdenes de Fondeo">
      <ContainerPage>
        <HeaderPage
          name={'Órdenes de Fondeo'}
          links={[{ name: 'Inicio', href: PATH_DASHBOARD.root }, { name: 'Órdenes de Fondeo' }]}
        />
        <FundingOrdersTable />
        {openConciliateModal && <ConciliateModal />}
        {openCancelFundingOrder && <CancelFundingOrder />}
        {openDetailsFundingOrder && <FundingOrderDetails />}
      </ContainerPage>
    </Page>
  )
}

export default FundingOrders
