import { lazy } from 'react'

import { SUPPORT_PATHS } from '../../shared/routes/support-paths'
import TicketsSupportList from '../components/TicketsSupportList'

import { PATH_DASHBOARD } from '@/routes'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const TicketSupportConversationDrawer = Lodable(
  lazy(() => import('../components/conversation/TicketSupportConversationDrawer'))
)

export const SupportIncidences = () => (
  //  const { data, isLoading } = useFindProfiles()

  <Page title="Incidencias & Consultas">
    <ContainerPage>
      <HeaderPage
        name={'Incidencias & Consultas'}
        links={[
          { name: 'Inicio', href: PATH_DASHBOARD.root },
          { name: 'Soporte', href: SUPPORT_PATHS.incidences },
          { name: 'Incidencias' }
        ]}
      />
      <TicketsSupportList />
      <TicketSupportConversationDrawer />
    </ContainerPage>
  </Page>
)
