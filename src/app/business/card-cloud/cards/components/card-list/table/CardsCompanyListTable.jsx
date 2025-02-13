import { useState } from 'react'

import { Badge, Box, Button, Card, CardHeader, Stack, styled } from '@mui/material'
import { BsPersonBadge } from 'react-icons/bs'

import { CardsCompanyTableActions } from './CardsCompanyTableActions'

import { useAdminCompanyCardsListColumns } from '../../../hooks'
import { useCardsOfCardCloudStore } from '../../../store'

import { useCardCloudSharedStore } from '@/app/business/card-cloud/shared/store'
import {
  MaterialDataTable,
  MaterialDataTableBottomToolbarPagination,
  MaterialDataTableToolbarExportActions
} from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    // right: 5,
    // top: 25,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: 4
  }
}))

export const CardsCompanyListTable = ({ cardsQuery }) => {
  const { data: cards, isLoading, isError, error, isFetching, refetch } = cardsQuery

  const [enablePagination, setEnablePagination] = useState(true)

  const columns = useAdminCompanyCardsListColumns()

  const { setSelectedCards, setOpenAssignCards } = useCardsOfCardCloudStore()
  const { selectedCompany } = useCardCloudSharedStore()

  const table = useMaterialTable(isError, error, {
    columns,
    data: cards || [],
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: row => Boolean(!row?.original?.isAssigned),
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
    renderRowActions: table => <CardsCompanyTableActions table={table} />,
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
        fileName={`Tarjetas Empresa - ${selectedCompany?.name} - Card Cloud`}
        handleRefetch={() => refetch()}
      />
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }} alignItems={'center'}>
        <Stack>
          <StyledBadge max={999} badgeContent={table.getSelectedRowModel().flatRows?.length || 0} color="primary">
            <Button
              sx={{ color: 'text.primary' }}
              startIcon={<BsPersonBadge width={24} height={24} />}
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              variant="outlined"
              onClick={handleAssigned}
            >
              Asignar
            </Button>
          </StyledBadge>
        </Stack>
      </Box>
    )
  })

  const handleAssigned = () => {
    const selected = table.getSelectedRowModel().flatRows?.map(row => row.original) ?? []
    setSelectedCards(selected)
    setOpenAssignCards(true)
    table?.resetRowSelection()
  }

  return (
    <Card variant="outlined">
      <CardHeader
        sx={theme => ({
          pb: 2
        })}
        title={`Lista de Tarjetas`}
        subheader={`Tienes ${cards?.length || 0} tarjetas en la empresa`}
      />
      <MaterialDataTable table={table} />
    </Card>
  )
}
