import { lazy, useEffect, useState } from 'react'

import { Add, AddBusinessTwoTone, Apps, FormatListBulleted } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useSnackbar } from 'notistack'

import { MANAGEMENT_PATHS, MANAGEMENT_ROUTES_NAMES } from '@/app/management/shared/routes'
import { StockCardSidebar, StockCardTable } from '@/app/management/stock-cards/components'
import { useFindAffiliatedCommerces, useFindStockCards } from '@/app/management/stock-cards/hooks'
import { useAssignCardStore } from '@/app/management/stock-cards/store'
import { CardsList } from '@/app/shared/components'
import { useFindCardTypes } from '@/app/shared/hooks'
import { PATH_DASHBOARD } from '@/routes'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const AssignCardModal = Lodable(lazy(() => import('@/app/management/stock-cards/components/AssignCardModal')))

export default function StockCards() {
  const [open, setOpen] = useState(false)
  const { data: affiliatedCommerces, isSuccess, isLoading } = useFindAffiliatedCommerces()
  const { data: cardTypes, isSuccess: isSuccessCardTypes, isLoading: isLoadingCardTypes } = useFindCardTypes()
  const stockCards = useFindStockCards()
  const { data: cards, isLoading: isLoadingStockCards } = stockCards
  const setOpenAssignCards = useAssignCardStore(state => state.setOpen)
  const setReadyToAssign = useAssignCardStore(state => state.setReadyToAssign)
  const openAssignCard = useAssignCardStore(state => state.open)
  const { enqueueSnackbar } = useSnackbar()
  const [view, setView] = useState('1')
  const handleChange = (event, newValue) => {
    setView(newValue)
  }

  const handleNewCard = () => {
    if (affiliatedCommerces && cardTypes && isSuccessCardTypes && isSuccess) {
      setOpen(true)
    } else {
      enqueueSnackbar(`Por el momento no se puede crear una tarjeta. Intente nuevamenta o reporte a sistemas`, {
        variant: 'warning',
        autoHideDuration: 5000
      })
    }
  }

  const handleAssignCards = () => {
    if (affiliatedCommerces && affiliatedCommerces.length > 0 && cardTypes && cardTypes.length > 0) {
      setOpenAssignCards(true)
    } else {
      setOpenAssignCards(false)
      enqueueSnackbar(`Por el momento no se puede asignar tarjetas. No hay comercios disponibles`, {
        variant: 'warning',
        autoHideDuration: 5000
      })
    }
  }

  useEffect(() => {
    if (affiliatedCommerces && affiliatedCommerces.length > 0) {
      setReadyToAssign(true)
    } else {
      setReadyToAssign(false)
    }
  }, [affiliatedCommerces])

  return (
    <Page title="Stock de Tarjetas">
      <ContainerPage>
        <HeaderPage
          name={'Stock de Tarjetas'}
          links={[
            { name: 'Inicio', href: PATH_DASHBOARD.root },
            { name: 'Administracion', href: MANAGEMENT_PATHS.stock_cards },
            { name: MANAGEMENT_ROUTES_NAMES.stock_cards.name }
          ]}
          buttons={
            <Stack direction={'column'} spacing={2} mt={{ xs: 2, md: 0 }}>
              <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                {cards && cards?.length > 0 && (
                  <Button
                    sx={{ color: 'text.primary' }}
                    type="button"
                    color="secondary"
                    variant="contained"
                    onClick={handleAssignCards}
                    startIcon={<AddBusinessTwoTone />}
                  >
                    Asignar Tarjetas
                  </Button>
                )}

                <LoadingButton
                  loading={isLoading || isLoadingCardTypes}
                  variant="contained"
                  onClick={handleNewCard}
                  startIcon={<Add />}
                >
                  Nueva Tarjeta
                </LoadingButton>
              </Stack>
              <Stack alignItems={{ xs: 'center', md: 'flex-end' }}>
                <ToggleButtonGroup
                  size={'small'}
                  color="primary"
                  value={view}
                  exclusive
                  onChange={handleChange}
                  aria-label="Platform"
                >
                  <ToggleButton value="1">
                    <FormatListBulleted />
                  </ToggleButton>
                  <ToggleButton value="2">
                    <Apps />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Stack>
          }
        />
        {view === '2' && <CardsList cards={stockCards} />}
        {view === '1' && <StockCardTable cards={cards} isLoading={isLoadingStockCards} />}
        <StockCardSidebar open={open} setOpen={setOpen} />
        {openAssignCard && <AssignCardModal />}
      </ContainerPage>
    </Page>
  )
}
