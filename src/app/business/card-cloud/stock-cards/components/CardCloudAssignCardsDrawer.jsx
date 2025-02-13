import { lazy, useEffect } from 'react'

import { Stack, Typography } from '@mui/material'

import { useFindCardCloudCompanies } from '../../shared/hooks'
import { useStockCardsOfCardCloudStore } from '../store'

import { RightPanel } from '@/app/shared/components'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'

const CardCloudAssignCardsForm = Lodable(lazy(() => import('./CardCloudAssignCardsForm')))

const CardCloudAssignCardsDrawer = () => {
  const { openAssignCards, setOpenAssignCards } = useStockCardsOfCardCloudStore()

  const { data: companies, isLoading, isError, error, refetch } = useFindCardCloudCompanies({ enabled: false })

  const handleClose = () => {
    setOpenAssignCards(false)
  }

  useEffect(() => {
    if (openAssignCards) {
      refetch()
    }
  }, [openAssignCards])

  return (
    <RightPanel
      open={!!openAssignCards}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>{'Asignar Tarjetas'}</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack spacing={3} p={3}>
          {isLoading && <RequestLoadingComponent />}
          {isError && !isLoading && (
            <ErrorRequestPage errorMessage={error} titleMessage={'Lista de Usuarios'} handleButton={() => refetch()} />
          )}
          {!isError && !isLoading && openAssignCards && (
            <CardCloudAssignCardsForm companies={companies} onSuccess={handleClose} />
          )}
        </Stack>
      </Scrollbar>
    </RightPanel>
  )
}

export default CardCloudAssignCardsDrawer
