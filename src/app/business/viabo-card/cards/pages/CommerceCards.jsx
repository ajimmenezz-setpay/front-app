import { useEffect } from 'react'

import { Box } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

import { CARDS_COMMERCES_KEYS } from '@/app/business/viabo-card/cards/adapters'
import { CardDetails, CardsSidebar } from '@/app/business/viabo-card/cards/components'
import { FundingOrder } from '@/app/business/viabo-card/cards/components/toolbar-actions'
import { VIABO_CARD_PATHS, VIABO_CARD_ROUTES_NAMES } from '@/app/business/viabo-card/routes'
import { PATH_DASHBOARD } from '@/routes'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'

export default function CommerceCards() {
  const queryClient = useQueryClient()

  useEffect(
    () => () => {
      const keysArray = Object.values(CARDS_COMMERCES_KEYS)
      queryClient.cancelQueries({ queryKey: keysArray })
    },
    []
  )

  return (
    <Page title="Lista de Tarjetas">
      <ContainerPage>
        <Box display={'flex'} overflow={'hidden'} sx={{ height: '100vH', maxHeight: '100%', flexDirection: 'column' }}>
          <Box px={1}>
            <HeaderPage
              name={'Lista de Tarjetas'}
              links={[
                { name: 'Inicio', href: PATH_DASHBOARD.root },
                { name: 'Viabo Card', href: VIABO_CARD_PATHS.cards },
                { name: VIABO_CARD_ROUTES_NAMES.cards.name }
              ]}
            />
          </Box>

          <Box display={'flex'} overflow={'hidden'} sx={{ flex: '1 1 0%' }}>
            <Box display={'block'} width={1} position={'absolute'}></Box>
            <CardsSidebar />

            <CardDetails />
          </Box>
        </Box>

        <FundingOrder />
      </ContainerPage>
    </Page>
  )
}
