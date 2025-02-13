import { lazy } from 'react'

import { SUPPORT_PATHS } from '../../shared/routes/support-paths'
import { SupportTicketsList } from '../components/SupportTicketsList'

import { PATH_DASHBOARD } from '@/routes'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const SupportTicketDetailsDrawer = Lodable(lazy(() => import('../components/SupportTicketDetailsDrawer')))

const TicketsSupportV2 = () => (
  <Page title="Soporte - Tickets">
    <ContainerPage>
      <HeaderPage
        name={'Soporte'}
        links={[
          { name: 'Inicio', href: PATH_DASHBOARD.root },
          { name: 'Soporte', href: SUPPORT_PATHS.incidences },
          { name: 'Tickets' }
        ]}
      />
      <SupportTicketsList />
      <SupportTicketDetailsDrawer />
    </ContainerPage>
  </Page>
)

export default TicketsSupportV2
