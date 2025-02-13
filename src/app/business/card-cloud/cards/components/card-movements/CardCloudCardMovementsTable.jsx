import { useState } from 'react'

import { CardCloudMovementsTableActions } from '../../../dashboard-master/components/movements/CardCloudMovementsTableActions'
import { useCardCloudCardMovementsColumns } from '../../hooks'

import {
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { MaterialDataTable } from '@/shared/components/dataTables/MaterialDataTable'
import { useMaterialTable } from '@/shared/hooks'

const CardCloudCardMovementsTable = ({ queryMovements, selectedCard }) => {
  const [enablePagination, setEnablePagination] = useState(true)

  const columns = useCardCloudCardMovementsColumns()

  const { isError, error, refetch, isLoading, isFetching } = queryMovements

  const movements = queryMovements?.data?.originalAdapted || []

  const table = useMaterialTable(isError, error, {
    columns,
    data: movements || [],
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
          id: 'date',
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
        fileName={`Movimientos Tarjeta - ${selectedCard?.number?.hidden} - Card Cloud`}
        handleRefetch={() => refetch()}
      />
    ),
    renderRowActions: table => <CardCloudMovementsTableActions table={table} />
  })

  return <MaterialDataTable table={table} />
}

export default CardCloudCardMovementsTable
