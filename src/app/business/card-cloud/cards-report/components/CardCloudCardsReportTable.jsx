import { useState } from 'react'

import { Card } from '@mui/material'

import { useCardCloudCardsReportColumns, useFindCardCloudCardsReport } from '../hooks'

import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

export const CardCloudCardsReportTable = () => {
  const [enablePagination, setEnablePagination] = useState(true)

  const { data: cards, isLoading, isFetching, isError, error, refetch } = useFindCardCloudCardsReport()

  const columns = useCardCloudCardsReportColumns() || []

  const table = useMaterialTable(isError, error, {
    columnFilterDisplayMode: 'subheader',
    columns,
    data: cards || [],
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
          id: 'balance',
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
        fileName={`Reporte Tarjetas - Card Cloud`}
        handleRefetch={refetch}
        pdfConfig={{
          orientation: 'l',
          unit: 'mm',
          format: 'a3'
        }}
      />
    )
  })

  return (
    <Card variant="outlined">
      <MaterialDataTable table={table} />
    </Card>
  )
}
