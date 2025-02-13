import { useState } from 'react'

import { Add } from '@mui/icons-material'
import { Button, Card, CardHeader } from '@mui/material'

import { CardCloudStockCardsTableActions } from './CardCloudStockCardsTableActions'

import { useFindCardsByAccountOfCardCloud, useStockCardsListColumnsOfCardCloud } from '../hooks'
import { useStockCardsOfCardCloudStore } from '../store'

import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

export const CardCloudStockCardsList = () => {
  const { data: cards, isLoading, isError, error, isFetching, refetch } = useFindCardsByAccountOfCardCloud()
  const columns = useStockCardsListColumnsOfCardCloud()
  const { setOpenAssignCards } = useStockCardsOfCardCloudStore()

  const [enablePagination, setEnablePagination] = useState(true)

  const table = useMaterialTable(isError, error, {
    columns,
    data: cards?.data || [],
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
    enableGlobalFilterModes: true,
    globalFilterModeOptions: ['contains'],
    initialState: {
      density: 'compact',
      sorting: [
        {
          id: 'id',
          desc: false
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
    renderRowActions: table => <CardCloudStockCardsTableActions table={table} />,
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
        fileName={'Stock de Tarjetas - Card Cloud'}
        handleRefetch={() => refetch()}
      />
    )
  })

  return (
    <Card variant="outlined">
      <CardHeader
        sx={theme => ({
          pb: 2
        })}
        title="Lista de Tarjetas"
        subheader={`Tienes ${cards?.total || 0} tarjetas en la cuenta`}
        action={
          <Button variant="outlined" startIcon={<Add />} onClick={() => setOpenAssignCards(true)}>
            Asignar Tarjetas
          </Button>
        }
      />
      <MaterialDataTable table={table} />
    </Card>
  )
}
