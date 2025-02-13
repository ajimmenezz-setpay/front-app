import { useFindProfiles } from '../../shared/hooks'
import { CATALOGS_PATHS } from '../../shared/routes'
import { NewCauseDrawer } from '../components'
import { CausesList } from '../components/CausesList'
import { useCausesStore } from '../store'

import { PATH_DASHBOARD } from '@/routes'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'

export const CatalogCauses = () => {
  const { data, isLoading } = useFindProfiles()
  const setOpenNewCause = useCausesStore(state => state.setOpenNewCause)

  return (
    <Page title="Catálogo de Causas">
      <ContainerPage>
        <HeaderPage
          name={'Catálogo de Causas'}
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'Catálogos', href: CATALOGS_PATHS.causes },
            { name: 'Causas' }
          ]}
          buttonName="Nueva Causa"
          onClick={() => setOpenNewCause(true)}
          loading={isLoading}
        />
        <CausesList />
      </ContainerPage>
      <NewCauseDrawer profiles={data} />
    </Page>
  )
}
