import { useEffect, useState } from 'react'

import { Add, ToggleOffTwoTone, ToggleOnTwoTone } from '@mui/icons-material'
import { Box, Button, Card, CardHeader, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { TbCreditCardPay } from 'react-icons/tb'

import { ViaboSpeiCompaniesTableActions } from './ViaboSpeiCompaniesTableActions'

import { useChangeSpeiCompanyStatus, useSpeiCompaniesTableColumns } from '../hooks'
import { useFindSpeiCompanies } from '../hooks/useFindSpeiCompanies'
import { useSpeiCompaniesStore } from '../store'

import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { ModalAlert } from '@/shared/components/modals'
import { useMaterialTable } from '@/shared/hooks'

export const ViaboSpeiCompaniesList = ({ isConcentrator }) => {
  const { data: companies, isLoading, isError, error, isFetching, refetch } = useFindSpeiCompanies()

  const { setOpenNewSpeiCompany, setSelectedCompanies, setOpenTransfer } = useSpeiCompaniesStore()
  const { originAccount } = useSpeiCompaniesStore()

  const columns = useSpeiCompaniesTableColumns()

  const [rowSelection, setRowSelection] = useState({})
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [causeIdToggleStatus, setCauseIdToggleStatus] = useState(null)
  const [companyData, setCompanyData] = useState(null)
  const [enablePagination, setEnablePagination] = useState(true)

  const { mutate: toggleStatus, isLoading: isChangingCauseStatus } = useChangeSpeiCompanyStatus()

  const handleSuccessChangeStatus = () => {
    setOpenConfirmation(false)
    toggleStatus(
      { ...companyData, changeStatus: !companyData?.status },
      {
        onSuccess: () => {
          setCauseIdToggleStatus(null)
          setCompanyData(null)
        },
        onError: () => {
          setCauseIdToggleStatus(null)
          setCompanyData(null)
        }
      }
    )
  }

  const table = useMaterialTable(isError, error, {
    columns,
    data: companies || [],
    enableSelectAll: !!isConcentrator,
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
          id: 'folio',
          desc: false
        }
      ]
    },
    onRowSelectionChange: setRowSelection,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      rowSelection
    },
    displayColumnDefOptions: {
      'mrt-row-select': {
        maxSize: 20
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
    enablePagination,
    muiSelectCheckboxProps: ({ row }) => {
      const rowData = row.original
      const disable = originAccount?.id === rowData?.id && !isConcentrator
      return {
        sx: {
          disabled: disable,
          display: disable ? 'none' : 'flex'
        }
      }
    },
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
        fileName={'Lista de Empresas - SPEI CLOUD'}
        handleRefetch={() => refetch()}
      />
    ),
    renderRowActions: table =>
      isConcentrator && (
        <ViaboSpeiCompaniesTableActions
          table={table}
          isChangingCauseStatus={isChangingCauseStatus}
          onChangeStatus={rowData => {
            setCompanyData(rowData)
            setCauseIdToggleStatus(rowData?.id)
            setOpenConfirmation(true)
          }}
          causeIdToggleStatus={causeIdToggleStatus}
        />
      )
  })

  const handleOpenTransfer = () => {
    const selectedAccounts = table.getSelectedRowModel().flatRows?.map(row => row.original) ?? []
    setSelectedCompanies(selectedAccounts)
    setOpenTransfer(true)
  }

  useEffect(() => {
    setRowSelection({})
  }, [originAccount])

  return (
    <>
      <Card variant="outlined">
        <CardHeader
          sx={theme => ({
            pb: 2
          })}
          title="Lista de Empresas"
          subheader={`Tienes ${companies?.length || 0} empresas dadas de alta`}
          action={
            isConcentrator && (
              <Tooltip title="Nueva Empresa">
                <IconButton color="primary" size="large" onClick={() => setOpenNewSpeiCompany(true)}>
                  <Add />
                </IconButton>
              </Tooltip>
            )
          }
        />
        <MaterialDataTable table={table} />
      </Card>
      <ModalAlert
        title={
          <Stack alignItems={'center'} justifyContent={'space-between'} flexDirection={'row'}>
            <Typography variant="h6">{companyData?.status ? 'Desactivar Empresa' : 'Activar Empresa'}</Typography>
            {companyData?.status ? <ToggleOffTwoTone color="error" /> : <ToggleOnTwoTone color="success" />}
          </Stack>
        }
        textButtonSuccess="Si"
        textButtonCancel="No"
        onClose={() => {
          setOpenConfirmation(false)
        }}
        open={openConfirmation}
        actionsProps={{ sx: { justifyContent: 'center' } }}
        description={
          <Stack spacing={3}>
            <Stack spacing={0.5} p={2} borderColor={'secondary.light'} borderRadius={2} sx={{ borderStyle: 'dotted' }}>
              <Typography fontWeight={'bold'} variant="subtitle2">
                {companyData?.name}
              </Typography>
              <Typography variant="subtitle2">{companyData?.rfc}</Typography>
              <Typography variant="subtitle2">{companyData?.account?.hidden}</Typography>
            </Stack>

            <Typography textAlign={'center'}>
              ¿Está seguro de{' '}
              <Box component={'span'} sx={{ fontWeight: 'bold' }}>{`${
                companyData?.status ? 'Desactivar' : 'Activar'
              }`}</Box>{' '}
              la empresa?
            </Typography>
          </Stack>
        }
        onSuccess={handleSuccessChangeStatus}
        fullWidth
        maxWidth="xs"
      />
    </>
  )
}
