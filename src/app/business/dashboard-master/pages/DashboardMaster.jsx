import { Box, Stack } from '@mui/material'

import { MasterGlobalCards } from '@/app/business/dashboard-master/components'
import { MasterMovements } from '@/app/business/dashboard-master/components/movements/MasterMovements'
import { FundingOrder } from '@/app/business/viabo-card/cards/components/toolbar-actions'
import { PATH_DASHBOARD } from '@/routes'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'

export default function DashboardMaster() {
  return (
    <Page title="Dashboard Master">
      <ContainerPage>
        <HeaderPage
          name={'Dashboard Master'}
          links={[{ name: 'Inicio', href: PATH_DASHBOARD.root }, { name: 'Dashboard Master' }]}
        />
        <Box pb={4}>
          <Stack flexDirection={{ md: 'row' }}>
            <MasterGlobalCards />
            <Stack flex={1}>
              <MasterMovements />
            </Stack>
          </Stack>
        </Box>

        <FundingOrder />
      </ContainerPage>
    </Page>
  )
}
