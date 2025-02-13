import { lazy, useEffect, useMemo, useState } from 'react'

import { Apps, FormatListBulleted, Refresh } from '@mui/icons-material'
import { Box, IconButton, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { endOfDay, startOfDay, sub } from 'date-fns'

import { useFindCardMovementsOfCardCloud } from '../../hooks'
import { useCardsOfCardCloudStore } from '../../store'

import { InputDateRange } from '@/shared/components/form'
import { Lodable } from '@/shared/components/lodables'
import { fTimestampUTC } from '@/shared/utils'
import { useResponsive } from '@/theme/hooks'

const CardCloudMovementSupportTicketDrawer = Lodable(
  lazy(() => import('../../../shared/components/ticket-support/CardCloudMovementSupportTicketDrawer'))
)
const CardCloudCardMovementsDetails = Lodable(lazy(() => import('./CardCloudCardMovementsDetails')))
const CardCloudCardMovementsTable = Lodable(lazy(() => import('./CardCloudCardMovementsTable')))

export const CardMovementsOfCardCloud = ({ headerProps }) => {
  const isDesktop = useResponsive('up', 'md')
  const [view, setView] = useState(isDesktop ? 'list' : 'details')

  const setFilter = useCardsOfCardCloudStore(state => state.setFilterMovements)
  const setFilterKeyMovements = useCardsOfCardCloudStore(state => state.setFilterKeyMovements)
  const filterDate = useCardsOfCardCloudStore(state => state.filterMovements)
  const selectedCard = useCardsOfCardCloudStore(state => state.selectedCard)

  const currentDate = new Date()

  const initialStartDate = useMemo(
    () => (filterDate?.startDate ? new Date(filterDate?.startDate) : sub(currentDate, { days: 30 })),
    [filterDate?.startDate]
  )
  const initialEndDate = useMemo(
    () => (filterDate?.endDate ? new Date(filterDate?.endDate) : currentDate),
    [filterDate?.endDate]
  )

  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)

  const filters = useMemo(
    () => ({ fromDate: fTimestampUTC(startOfDay(startDate)), toDate: fTimestampUTC(endOfDay(endDate)) }),
    [startDate, endDate]
  )

  const queryMovements = useFindCardMovementsOfCardCloud(filters, selectedCard?.id, {
    enabled: !!(selectedCard?.id && filters?.fromDate && filters?.toDate)
  })

  const { refetch, isRefetching: isFetching } = queryMovements

  const handleDateRange = range => {
    const { startDate, endDate } = range
    if (endDate !== null && startDate !== null) {
      setEndDate(endDate)
      setStartDate(startDate)
    }
  }

  useEffect(() => {
    if (startDate && endDate && selectedCard?.id) {
      refetch()
      setFilter({ startDate, endDate })
      setFilterKeyMovements(filters)
    }
  }, [startDate, endDate, selectedCard?.id])

  const handleChangeView = (event, newValue) => {
    if (newValue) {
      setView(newValue)
    }
  }

  return (
    <>
      <Stack gap={3}>
        <Box display="flex" alignItems={'center'} flexDirection={{ xs: 'column', sm: 'row' }} gap={2} {...headerProps}>
          <Box width={{ xs: '100%', md: '50%' }}>
            <InputDateRange startDate={startDate} endDate={endDate} onSubmit={handleDateRange} />
          </Box>
          <Box sx={{ flex: { xs: '0.1 0.1 auto', md: '0.5 0.5 auto', xl: '2 2 auto' } }} />
          <Stack gap={2} flexDirection={'row'} alignItems={'center'} justifyContent={{ xs: 'center', md: 'flex-end' }}>
            <Box>
              <IconButton
                size="small"
                onClick={refetch}
                sx={{ color: 'text.primary' }}
                disabled={isFetching}
                aria-haspopup="true"
                title="Actualizar Movimientos"
              >
                <Refresh width={20} height={20} />
              </IconButton>
            </Box>
            <ToggleButtonGroup
              size={'small'}
              color="primary"
              value={view}
              exclusive
              onChange={handleChangeView}
              aria-label="Platform"
            >
              <ToggleButton value="list">
                <FormatListBulleted />
              </ToggleButton>
              <ToggleButton value="details">
                <Apps />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
        {view === 'list' && <CardCloudCardMovementsTable queryMovements={queryMovements} selectedCard={selectedCard} />}
        {view === 'details' && <CardCloudCardMovementsDetails queryMovements={queryMovements} />}
      </Stack>
      <CardCloudMovementSupportTicketDrawer />
    </>
  )
}
