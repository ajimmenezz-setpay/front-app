import { useCardCloudBreadCrumbs } from '../../shared/hooks'
import { CardCloudDailyReportTable } from '../components/CardCloudDailyReportTable'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'

const CardCloudDailyReport = () => {
  const { dailyReport } = useCardCloudBreadCrumbs()

  return (
    <Page title={`Reporte Consumos Diarios | Card Cloud`}>
      <ContainerPage>
        <HeaderPage name={'Reporte Consumos Diarios'} links={dailyReport} />
        <CardCloudDailyReportTable />
      </ContainerPage>
    </Page>
  )
}

export default CardCloudDailyReport
