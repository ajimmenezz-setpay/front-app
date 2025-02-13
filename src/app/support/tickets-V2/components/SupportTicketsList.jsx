import { useState } from 'react'

import { Card } from '@mui/material'

import { SupportTicketsTableActions } from './SupportTicketsTableActions'

import { useFindSupportTickets, useSupportTicketsColumns } from '../hooks'

import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

export const SupportTicketsList = () => {
  const [enablePagination, setEnablePagination] = useState(true)

  const { data, isError, error, isLoading, isFetching, refetch } = useFindSupportTickets()
  const columns = useSupportTicketsColumns() || []

  const table = useMaterialTable(isError, error, {
    columnFilterDisplayMode: 'subheader',
    columns,
    data: data || [],
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: false,
    enableDensityToggle: false,
    positionActionsColumn: 'last',
    selectAllMode: 'all',
    globalFilterFn: 'contains',
    initialState: {
      density: 'compact',
      sorting: [
        {
          id: 'updatedAt',
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
        fileName={`Lista de Tickets `}
        handleRefetch={refetch}
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
    ),
    renderRowActions: table => <SupportTicketsTableActions table={table} />
  })
  return (
    <Card variant="outlined">
      <MaterialDataTable table={table} />
    </Card>
  )
}
