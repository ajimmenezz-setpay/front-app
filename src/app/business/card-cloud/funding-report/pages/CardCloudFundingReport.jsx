import { useCardCloudBreadCrumbs } from '../../shared/hooks'
import { CardCloudFundingReportTable } from '../components/CardCloudFundingReportTable'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'

const CardCloudFundingReport = () => {
  const { fundingReport } = useCardCloudBreadCrumbs()

  return (
    <Page title={`Reporte Fondeos | Card Cloud`}>
      <ContainerPage>
        <HeaderPage name={'Reporte de Fondeos'} links={fundingReport} />
        <CardCloudFundingReportTable />
      </ContainerPage>
    </Page>
  )
}

export default CardCloudFundingReport
