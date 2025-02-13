import { useEffect, useMemo, useState } from 'react'

import { Box, Card } from '@mui/material'
import { sub } from 'date-fns'

import { getLiquidatedMovementsActions } from './LiquidatedMovementsActions'

import { useFindViaboPayLiquidatedMovements, useLiquidatedMovementsColumns } from '../../hooks'
import { useViaboPayLiquidatedMovementsStore } from '../../store'

import { CardMovementsHeader } from '@/app/business/shared/components/card-movements/header-filter'
import { MaterialDataTable } from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

const LiquidatedMovementsTable = () => {
  const currentDate = new Date()

  const filterDate = useViaboPayLiquidatedMovementsStore(state => state.filterDate)

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

  const { data, isError, error, isLoading, isFetching, refetch } = useFindViaboPayLiquidatedMovements(
    startDate,
    endDate
  )

  useEffect(() => {
    if (startDate && endDate) {
      refetch()
    }
  }, [startDate, endDate])

  const columns = useLiquidatedMovementsColumns()

  const table = useMaterialTable(isError, error, {
    columns,
    data: data || [],
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    enableDensityToggle: false,
    positionActionsColumn: 'last',
    selectAllMode: 'all',
    initialState: {
      density: 'compact',
      sorting: [
        {
          id: 'serverDate',
          desc: true
        }
      ]
    },
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching
    },
    displayColumnDefOptions: {
      'mrt-row-select': {
        maxSize: 10
      },
      'mrt-row-actions': {
        header: 'Acciones',
        maxSize: 80
      }
    },
    muiTableContainerProps: { sx: { maxHeight: { md: '350px', lg: '450px', xl: '700px' } } },
    renderRowActionMenuItems: getLiquidatedMovementsActions,
    renderTopToolbarCustomActions: () => <Box></Box>
  })

  const handleDateRange = range => {
    const { startDate, endDate } = range
    if (endDate !== null && startDate !== null) {
      setEndDate(endDate)
      setStartDate(startDate)
    }
  }

  return (
    <Card variant={'outlined'}>
      <CardMovementsHeader
        startDate={startDate}
        endDate={endDate}
        onChangeDateRange={handleDateRange}
        hideBalance
        loading={isFetching}
      />
      <MaterialDataTable table={table} />
    </Card>
  )
}

export default LiquidatedMovementsTable
