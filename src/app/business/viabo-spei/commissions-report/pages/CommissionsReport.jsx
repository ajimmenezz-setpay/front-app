import { useViaboSpeiBreadCrumbs } from '../../shared/hooks'
import { CommissionsReportTable } from '../components/CommissionsReportTable'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'

export const CommissionsReport = () => {
  const { commissionsReport } = useViaboSpeiBreadCrumbs()

  return (
    <Page title={'Reporte de Comisiones - SPEI Cloud'}>
      <ContainerPage sx={{ pb: 3 }}>
        <HeaderPage name={'Reporte de Comisiones'} links={commissionsReport} />
        <CommissionsReportTable />
      </ContainerPage>
    </Page>
  )
}
