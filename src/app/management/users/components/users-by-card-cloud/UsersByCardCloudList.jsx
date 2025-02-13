import { useEffect, useState } from 'react'

import { Card, Stack, Typography } from '@mui/material'

import { useFindCardCloudUsers, useUsersCardCloudColumns } from '../../hooks'
import { ManagementUsersTableActions } from '../ManagementUsersTableActions'

import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

export const UsersByCardCloudList = ({ originAccount }) => {
  const {
    isError,
    error,
    data: users,
    isLoading,
    isFetching,
    refetch
  } = useFindCardCloudUsers(
    {
      companyId: originAccount?.id
    },
    {
      enabled: !!originAccount?.id
    }
  )

  useEffect(() => {
    if (originAccount?.id) {
      refetch()
    }
  }, [originAccount?.id])

  const columns = useUsersCardCloudColumns()

  const [enablePagination, setEnablePagination] = useState(true)

  const table = useMaterialTable(isError, error, {
    columns,
    data: users || [],
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
        maxSize: 20
      },
      'mrt-row-actions': {
        header: 'Acciones',
        minSize: 120
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
    enablePagination,
    renderRowActions: table => <ManagementUsersTableActions table={table} />,
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
        fileName={'Lista de Usuarios Tarjetahabientes'}
        handleRefetch={() => refetch()}
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
      <Stack px={2} pt={2} pb={isError ? 2 : 0} gap={2}>
        <Stack
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={2}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Typography variant="body2">{`Tienes ${users?.length || 0} usuarios`}</Typography>
        </Stack>
      </Stack>

      <MaterialDataTable table={table} />
    </Card>
  )
}
