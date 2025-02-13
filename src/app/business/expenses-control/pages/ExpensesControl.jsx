import { ExpensesTable } from '../components'

import { PATH_DASHBOARD } from '@/routes'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'

const ExpensesControl = () => (
  <Page title="Comprobaciones">
    <ContainerPage>
      <HeaderPage
        name={'Comprobaciones'}
        links={[{ name: 'Inicio', href: PATH_DASHBOARD.root }, { name: 'Comprobaciones' }]}
      />
      <ExpensesTable />
    </ContainerPage>
  </Page>
)

export default ExpensesControl
