import { useEffect, useMemo, useState } from 'react'

import { Avatar, Card, Stack, Typography } from '@mui/material'

import { BillingReportFilterDate } from './BillingReportFilterDate'

import { useFindSpeiCloudBillingReportMovements, useSpeiCloudBillingReportColumns } from '../hooks'
import { useSpeiBillingReportStore } from '../store'

import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'
import { stringAvatar } from '@/theme/utils'

export const BillingReportTable = ({ queryAccounts, isConcentrator }) => {
  const { selectedCompany, filterDate } = useSpeiBillingReportStore()
  const { setFilterDate } = useSpeiBillingReportStore()

  const initialStartDate = useMemo(() => filterDate || new Date(), [filterDate])

  const [startDate, setStartDate] = useState(initialStartDate)

  const filters = useMemo(
    () => ({
      month: startDate?.getMonth() + 1,
      year: startDate?.getFullYear(),
      account: selectedCompany?.account?.number
    }),
    [selectedCompany?.account?.number, startDate]
  )

  const queryBillingMovements = useFindSpeiCloudBillingReportMovements(filters, {
    enabled: false
  })

  const [enablePagination, setEnablePagination] = useState(true)

  const columns = useSpeiCloudBillingReportColumns()

  const movements = queryBillingMovements?.data || []

  const isLoading = queryBillingMovements?.isLoading || queryAccounts?.isLoading
  const isError = queryBillingMovements?.isError || queryAccounts?.isError
  const error = queryBillingMovements?.error || queryAccounts?.error
  const isFetching = queryBillingMovements?.isFetching

  const handleRefetch = () => {
    if (queryAccounts?.isError) {
      queryAccounts?.refetch()
    }
    queryBillingMovements?.refetch()
  }

  useEffect(() => {
    if (selectedCompany?.account?.number && startDate) {
      queryBillingMovements.refetch()
      setFilterDate(startDate)
    }
  }, [selectedCompany?.account?.number, startDate])

  const table = useMaterialTable(isError, error, {
    columns,
    data: movements || [],
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
          id: 'date',
          desc: true
        }
      ],
      columnVisibility: { trackingKey: false }
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
        fileName={`Estado de Cuenta ${isConcentrator ? 'Concentradora' : 'Empresa'} - SPEI Cloud`}
        handleRefetch={handleRefetch}
        pdfConfig={{
          orientation: 'l',
          unit: 'mm',
          format: 'legal',
          columnStyles: {
            0: { cellWidth: 25 }, // Columna 1 con un ancho de 20
            1: { cellWidth: 30 }, // Columna 2 con un ancho de 30
            9: { cellWidth: 30 } // Columna 8 con un ancho de 30
          }
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
          <Stack flexDirection={'row'} gap={2} alignItems={'center'}>
            <Avatar {...stringAvatar(selectedCompany?.name || '...')}></Avatar>
            <Stack>
              <Typography component={'p'} variant="h6" sx={{ textWrap: 'balance' }}>
                {selectedCompany?.name}
              </Typography>
              <Typography variant="body2">{`Tienes ${movements?.length || 0} movimientos en la ${isConcentrator ? 'Concentradora' : 'Empresa'}`}</Typography>
            </Stack>
          </Stack>
          <BillingReportFilterDate
            setFilterDate={setStartDate}
            filterDate={startDate}
            isLoading={isLoading || isFetching}
          />
        </Stack>
      </Stack>

      <MaterialDataTable table={table} />
    </Card>
  )
}
