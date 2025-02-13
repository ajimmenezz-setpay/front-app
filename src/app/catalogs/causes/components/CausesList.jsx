import { Box, Card } from '@mui/material'

import { getCausesTableActions } from './CausesTableActions'

import { useCausesColumns, useFindCausesList } from '../hooks'

import { MaterialDataTable } from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

export const CausesList = () => {
  const { data: thirdAccounts, isLoading, isError, error, isFetching } = useFindCausesList()

  const columns = useCausesColumns()

  const table = useMaterialTable(isError, error, {
    columns,
    data: thirdAccounts || [],
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
          id: 'cause',
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
    muiTableContainerProps: { sx: { maxHeight: { md: '350px', lg: '450px', xl: '700px' } } },
    enableColumnResizing: true,
    layoutMode: 'grid',
    renderTopToolbarCustomActions: () => <Box></Box>,
    renderRowActions: table => getCausesTableActions(table)
  })

  return (
    <Card variant="outlined">
      <MaterialDataTable table={table} />
    </Card>
  )
}
