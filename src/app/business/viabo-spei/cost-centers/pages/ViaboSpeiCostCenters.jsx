import { lazy } from 'react'

import { useViaboSpeiBreadCrumbs } from '../../shared/hooks'
import { ViaboSpeiCostCentersList } from '../components/ViaboSpeiCostCentersList'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const SpeiNewCostCenterDrawer = Lodable(lazy(() => import('../components/new-cost-center/SpeiNewCostCenterDrawer')))

export const ViaboSpeiCostCenters = () => {
  const { costCenters } = useViaboSpeiBreadCrumbs()

  return (
    <Page title="Centro de Costos - Spei Cloud">
      <ContainerPage sx={{ pb: 3 }}>
        <HeaderPage name={'Centro de Costos'} links={costCenters} />
        <ViaboSpeiCostCentersList />
        <SpeiNewCostCenterDrawer />
      </ContainerPage>
    </Page>
  )
}
