import { lazy } from 'react'

import { CommerceList } from '@/app/management/commerces/components'
import { MANAGEMENT_PATHS, MANAGEMENT_ROUTES_NAMES } from '@/app/management/shared/routes'
import { PATH_DASHBOARD } from '@/routes'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const CommerceDetails = Lodable(lazy(() => import('../components/CommerceDetails')))
const CommerceCommissions = Lodable(lazy(() => import('../components/CommerceCommissions')))
const CommerceServices = Lodable(lazy(() => import('../components/CommerceServices')))

export default function ManagementCommerces() {
  return (
    <Page title="Administración Comercios">
      <ContainerPage>
        <HeaderPage
          name={'Comercios'}
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'Administración', href: MANAGEMENT_PATHS.commerces },
            { name: MANAGEMENT_ROUTES_NAMES.commerces.name }
          ]}
        />
        <CommerceList />
        <CommerceDetails />
        <CommerceCommissions />
        <CommerceServices />
      </ContainerPage>
    </Page>
  )
}
