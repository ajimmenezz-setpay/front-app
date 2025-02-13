import { useCardCloudBreadCrumbs } from '../../shared/hooks'
import { CardCloudCardsReportTable } from '../components/CardCloudCardsReportTable'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'

const CardCloudCardsReport = () => {
  const { cardsReport } = useCardCloudBreadCrumbs()

  return (
    <Page title={`Reporte Tarjetas | Card Cloud`}>
      <ContainerPage>
        <HeaderPage name={'Reporte Tarjetas'} links={cardsReport} />
        <CardCloudCardsReportTable />
      </ContainerPage>
    </Page>
  )
}

export default CardCloudCardsReport
