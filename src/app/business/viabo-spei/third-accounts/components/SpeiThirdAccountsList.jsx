import { useState } from 'react'

import { Add } from '@mui/icons-material'
import { Box, Button, Card, CardHeader, IconButton, Tooltip } from '@mui/material'
import { TbCreditCardPay } from 'react-icons/tb'

import { getSpeiThirdAccountsTableActions } from './SpeiThirdAccountsTableActions'

import { useFindSpeiThirdAccountsList, useSpeiThirdAccountsColumns } from '../hooks'
import { useSpeiThirdAccounts } from '../store'

import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

export const SpeiThirdAccountsList = () => {
  const [enablePagination, setEnablePagination] = useState(true)

  const { data: thirdAccounts, isLoading, isError, error, isFetching, refetch } = useFindSpeiThirdAccountsList()

  const { setOpenNewSpeiThirdAccount, setOpenTransfer, setSelectedThirdAccounts } = useSpeiThirdAccounts()

  const columns = useSpeiThirdAccountsColumns()

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
          id: 'name',
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
    enableColumnResizing: true,
    layoutMode: 'grid',
    enablePagination,
    renderBottomToolbar: ({ table }) => (
      <MaterialDataTableBottomToolbarPagination
        enablePagination={enablePagination}
        setEnablePagination={setEnablePagination}
        table={table}
      />
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Button
          onClick={handleOpenTransfer}
          startIcon={<TbCreditCardPay />}
          sx={{ color: 'text.primary' }}
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          variant="outlined"
        >
          Transferir
        </Button>
      </Box>
    ),
    renderToolbarInternalActions: ({ table }) => (
      <MaterialDataTableToolbarExportActions
        table={table}
        columns={columns}
        fileName={'Lista de Cuentas de Terceros - SPEI CLOUD'}
        handleRefetch={() => refetch()}
      />
    ),
    renderRowActions: table => getSpeiThirdAccountsTableActions(table)
  })

  const handleOpenTransfer = () => {
    const selectedAccounts = table.getSelectedRowModel().flatRows?.map(row => row.original) ?? []
    setSelectedThirdAccounts(selectedAccounts)
    setOpenTransfer(true)
  }

  return (
    <Card variant="outlined">
      <CardHeader
        sx={theme => ({
          pb: 2
        })}
        title="Lista de Cuentas"
        subheader={`Tienes ${thirdAccounts?.length || 0} cuentas dadas de alta`}
        action={
          <Tooltip title="Nueva Cuenta">
            <IconButton color="primary" size="large" onClick={() => setOpenNewSpeiThirdAccount(true)}>
              <Add />
            </IconButton>
          </Tooltip>
        }
      />
      <MaterialDataTable table={table} />
    </Card>
  )
}
