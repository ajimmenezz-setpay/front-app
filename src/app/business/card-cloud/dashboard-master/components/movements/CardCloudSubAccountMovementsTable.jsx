import { useState } from 'react'

import { Avatar, Card, Stack, Typography } from '@mui/material'

import { CardCloudMovementsTableActions } from './CardCloudMovementsTableActions'

import { useCardCloudSharedStore } from '../../../shared/store'
import { useCardCloudSubAccountFilterMovements, useCardCloudSubAccountMovementsColumns } from '../../hooks'

import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { InputDateRange } from '@/shared/components/form'
import { useMaterialTable } from '@/shared/hooks'
import { stringAvatar } from '@/theme/utils'

export const CardCloudSubAccountMovementsTable = () => {
  const companySubAccountInfo = useCardCloudSharedStore(state => state.companySubAccountInfo)

  const { queryMovements, selectedCompany, setEndDate, setStartDate, startDate, endDate } =
    useCardCloudSubAccountFilterMovements()

  const { isError, error, refetch, isLoading, isFetching } = queryMovements

  const [enablePagination, setEnablePagination] = useState(true)

  const columns = useCardCloudSubAccountMovementsColumns()

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
        fileName={`Movimientos Empresa - ${selectedCompany?.name} - Card Cloud`}
        handleRefetch={() => refetch()}
      />
    ),
    renderRowActions: table => <CardCloudMovementsTableActions table={table} />
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
        <Stack flexDirection={'row'} gap={2} alignItems={'center'} justifyContent={'space-between'}>
          <Stack flexDirection={'row'} gap={2} alignItems={'center'}>
            <Avatar {...stringAvatar(selectedCompany?.name || '')}></Avatar>
            <Stack>
              <Typography variant="h6">Movimientos {selectedCompany?.name}</Typography>
              <Typography variant="body2">{`Tienes ${movements?.length || 0} movimientos en la empresa`}</Typography>
            </Stack>
          </Stack>

          <Typography fontWeight={'bold'} sx={{ typography: 'h3' }}>
            {companySubAccountInfo?.wallet?.balance?.format}
          </Typography>
        </Stack>

        <InputDateRange startDate={startDate} endDate={endDate} onSubmit={handleDateRange} />
      </Stack>

      <MaterialDataTable table={table} />
    </Card>
  )
}
