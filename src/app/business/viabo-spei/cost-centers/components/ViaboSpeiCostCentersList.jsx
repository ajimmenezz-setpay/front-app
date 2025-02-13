import { Add } from '@mui/icons-material'
import { Box, Card, CardHeader, IconButton, Tooltip } from '@mui/material'

import { getViaboSpeiCostCentersTableActions } from './ViaboSpeiCostCenterTableActions'

import { useFindSpeiCostCenters, useSpeiCostCentersTableColumns } from '../hooks'
import { useSpeiCostCentersStore } from '../store'

import { MaterialDataTable } from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

export const ViaboSpeiCostCentersList = () => {
  const { data: costCenters, isLoading, isError, error, isFetching } = useFindSpeiCostCenters()

  const { setOpenNewSpeiCostCenter } = useSpeiCostCentersStore()

  const columns = useSpeiCostCentersTableColumns()

  const table = useMaterialTable(isError, error, {
    columns,
    data: costCenters || [],
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
    muiTableContainerProps: { sx: { maxHeight: { md: '350px', lg: '450px', xl: '700px' } } },
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
    renderTopToolbarCustomActions: () => <Box></Box>,
    renderRowActions: table => getViaboSpeiCostCentersTableActions(table)
  })

  return (
    <Card variant="outlined">
      <CardHeader
        sx={theme => ({
          pb: 2
        })}
        title="Lista de Centros de Costos"
        subheader={`Tienes ${costCenters?.length || 0} centros de costos dados de alta`}
        action={
          <Tooltip title="Nueva Centro de Costos">
            <IconButton color="primary" size="large" onClick={() => setOpenNewSpeiCostCenter(true)}>
              <Add />
            </IconButton>
          </Tooltip>
        }
      />
      <MaterialDataTable table={table} />
    </Card>
  )
}
