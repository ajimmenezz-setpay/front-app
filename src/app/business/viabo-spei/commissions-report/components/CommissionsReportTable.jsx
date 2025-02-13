import { useEffect, useMemo, useState } from 'react'

import { Card, Stack, Typography } from '@mui/material'
import { endOfDay, format, startOfDay, sub } from 'date-fns'

import { useFindSpeiCloudCommissionsReportMovements, useSpeiCloudCommissionsReportColumns } from '../hooks'
import { useSpeiCommissionsReportStore } from '../store'

import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { InputDateRange } from '@/shared/components/form'
import { useMaterialTable } from '@/shared/hooks'

export const CommissionsReportTable = () => {
  const { filterDate } = useSpeiCommissionsReportStore()
  const { setFilterDate } = useSpeiCommissionsReportStore()

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
    () => ({
      startDay: format(startOfDay(startDate), 'yyyy-MM-dd'),
      endDay: format(endOfDay(endDate), 'yyyy-MM-dd')
    }),
    [startDate, endDate]
  )

  const queryCommissionsMovements = useFindSpeiCloudCommissionsReportMovements(filters, {
    enabled: Boolean(startDate && endDate)
  })

  const [enablePagination, setEnablePagination] = useState(true)

  const columns = useSpeiCloudCommissionsReportColumns()

  const movements = queryCommissionsMovements?.data || []

  const isLoading = queryCommissionsMovements?.isLoading
  const isError = queryCommissionsMovements?.isError
  const error = queryCommissionsMovements?.error
  const isFetching = queryCommissionsMovements?.isFetching

  const handleRefetch = () => {
    queryCommissionsMovements?.refetch()
  }

  useEffect(() => {
    if (startDate) {
      queryCommissionsMovements.refetch()
      setFilterDate({ startDate, endDate })
    }
  }, [startDate, endDate])

  const table = useMaterialTable(isError, error, {
    columns,
    data: movements || [],
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableFacetedValues: true,
    enableRowActions: false,
    enableRowSelection: false,
    enableDensityToggle: false,
    positionActionsColumn: 'last',
    selectAllMode: 'all',
    globalFilterFn: 'contains',
    initialState: {
      density: 'compact',
      sorting: [
        {
          id: 'date',
          desc: true
        }
      ],
      columnVisibility: { trackingKey: false }
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
    muiTableBodyRowProps: ({ row }) => ({
      sx: theme => ({
        backgroundColor: 'inherit',
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }
      })
    }),
    enableColumnResizing: true,
    layoutMode: 'grid',
    enablePagination, // default to true
    renderBottomToolbar: ({ table }) => (
      <MaterialDataTableBottomToolbarPagination
        enablePagination={enablePagination}
        setEnablePagination={setEnablePagination}
        table={table}
      />
    ),
    renderToolbarInternalActions: ({ table }) => (
      <MaterialDataTableToolbarExportActions
        table={table}
        columns={columns}
        fileName={`Reporte de Comisiones - SPEI Cloud`}
        handleRefetch={handleRefetch}
        pdfConfig={{
          orientation: 'l',
          unit: 'mm',
          format: 'a3',
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 30 },
            11: { cellWidth: 30 },
            12: { cellWidth: 30 }
          }
        }}
      />
    )
  })

  const handleDateRange = range => {
    const { startDate, endDate } = range
    if (endDate !== null && startDate !== null) {
      setEndDate(endDate)
      setStartDate(startDate)
    }
  }

  return (
    <Card variant="outlined">
      <Stack px={2} pt={2} pb={isError ? 2 : 0} gap={2}>
        <Stack
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={2}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Typography variant="body2">{`Tienes ${movements?.length || 0} movimientos la concentradora`}</Typography>
        </Stack>
        <InputDateRange
          options={{
            hideDefaultRanges: true,
            minDate: sub(currentDate, { days: 90 }),
            maxDate: currentDate
          }}
          startDate={startDate}
          endDate={endDate}
          onSubmit={handleDateRange}
        />
      </Stack>

      <MaterialDataTable table={table} />
    </Card>
  )
}
