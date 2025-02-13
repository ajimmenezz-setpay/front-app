import { useEffect, useMemo, useState } from 'react'

import { Card, Divider, Stack, Typography } from '@mui/material'
import { endOfDay, format, startOfDay } from 'date-fns'

import { useCardCloudDailyReportColumns, useFindCardCloudDailyConsumeReport } from '../hooks'

import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { InputDateRange } from '@/shared/components/form'
import { useMaterialTable } from '@/shared/hooks'

const currentDate = new Date()

export const CardCloudDailyReportTable = () => {
  const [filterDate, setFilterDate] = useState({
    startDate: currentDate,
    endDate: currentDate
  })

  const filters = useMemo(
    () => ({
      from: format(startOfDay(filterDate?.startDate), 'yyyy-MM-dd'),
      to: format(endOfDay(filterDate?.endDate), 'yyyy-MM-dd')
    }),
    [filterDate]
  )

  const queryDailyReport = useFindCardCloudDailyConsumeReport(filters, {
    enabled: Boolean(filterDate)
  })

  const [enablePagination, setEnablePagination] = useState(true)

  const columns = useCardCloudDailyReportColumns()

  const movements = queryDailyReport?.data?.movements || []

  const isLoading = queryDailyReport?.isLoading
  const isError = queryDailyReport?.isError
  const error = queryDailyReport?.error
  const isFetching = queryDailyReport?.isFetching

  const handleRefetch = () => {
    queryDailyReport?.refetch()
  }

  useEffect(() => {
    if (filterDate) {
      queryDailyReport?.refetch()
    }
  }, [filterDate])

  const table = useMaterialTable(isError, error, {
    columnFilterDisplayMode: 'subheader',
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
      showColumnFilters: true,
      columnVisibility: { environment: false }
    },
    getRowId: (originalRow, index) => `${originalRow?.authCode}-${index}`,
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
        fileName={`Reporte Diario de Consumos ${filterDate?.startDate?.toLocaleDateString()} a ${filterDate?.endDate?.toLocaleDateString()} - Card Cloud`}
        handleRefetch={handleRefetch}
        pdfConfig={{
          orientation: 'l',
          unit: 'mm',
          format: 'a3',
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 30 }
          }
        }}
      />
    )
  })

  const handleDateRange = range => {
    const { startDate, endDate } = range
    if (endDate !== null && startDate !== null) {
      setFilterDate({ startDate, endDate })
    }
  }

  return (
    <Card variant="outlined">
      <Stack px={2} pt={2} pb={isError ? 2 : 0} gap={2}>
        <Stack
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Stack flex={1} width={1} maxWidth={{ xs: 'auto', sm: '40%', md: '30%' }}>
            <InputDateRange
              startDate={filterDate?.startDate}
              endDate={filterDate?.endDate}
              onSubmit={handleDateRange}
            />
          </Stack>
          <Stack sx={{ flexDirection: 'row', justifyContent: { xs: 'center', sm: 'flex-end' } }}>
            <Stack
              justifyContent={'center'}
              alignItems={'center'}
              flexDirection={'row'}
              gap={2}
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            >
              <Typography
                sx={{ typography: 'h3', fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
                fontWeight={'bold'}
              >
                {queryDailyReport?.isFetching ? '...' : queryDailyReport?.data?.balance?.format || '$0.00'}
              </Typography>

              <Stack justifyContent={'center'} alignItems={'center'}>
                <Typography variant="caption" color={'text.secondary'}>
                  Última actualización
                </Typography>
                <Typography variant="subtitle2" color={'text.secondary'}>
                  {queryDailyReport?.isFetching ? '...' : queryDailyReport?.data?.lastUpdate?.format || '-'}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <MaterialDataTable table={table} />
    </Card>
  )
}
