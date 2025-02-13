import { useMemo } from 'react'

import { Box, Stack, Typography, useTheme } from '@mui/material'
import { createMRTColumnHelper } from 'material-react-table'

import { Label } from '@/shared/components/form'
import { MasterCardLogo } from '@/shared/components/images'

export const useAdminCompanyCardsListColumns = () => {
  const theme = useTheme()
  const columnHelper = createMRTColumnHelper()

  return useMemo(
    () => [
      columnHelper.accessor('id', {
        id: 'id',
        accessorFn: originalRow => originalRow?.clientId || null,
        header: 'ID',
        enableHiding: false,
        maxSize: 150,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          const id = dataRow?.clientId || ''
          return <Typography variant="subtitle2">{id}</Typography>
        }
      }),
      columnHelper.accessor('number', {
        id: 'number',
        accessorFn: originalRow => originalRow?.number?.bin || null,
        header: 'Tarjeta',
        enableHiding: false,
        Cell: ({ cell, column, row }) => {
          const { original: dataRow } = row
          return (
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <MasterCardLogo sx={{ width: 25, height: 25 }} />
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                {dataRow?.number?.hidden}
              </Typography>
            </Stack>
          )
        }
      }),
      columnHelper.accessor('balance', {
        id: 'balance',
        accessorFn: originalRow => originalRow?.balance?.number ?? null,
        header: 'Balance',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return <Typography variant="subtitle2">{dataRow?.balance?.format}</Typography>
        }
      }),
      columnHelper.accessor('assigned', {
        id: 'assigned',
        header: 'Asignado',
        filterVariant: 'select',
        minSize: 220,
        accessorFn: originalRow =>
          `${originalRow?.userAssigned?.fullName} - ${originalRow?.userAssigned?.email}` || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return (
            <Stack>
              <Typography variant="subtitle2">{dataRow?.userAssigned?.fullName}</Typography>
              <Typography title={dataRow?.userAssigned?.email} variant="subtitle2" color="text.secondary">
                {dataRow?.userAssigned?.email}
              </Typography>
            </Stack>
          )
        }
      }),
      columnHelper.accessor('type', {
        id: 'type',
        header: 'Tipo',
        filterVariant: 'select',
        maxSize: 100,
        accessorFn: originalRow => originalRow?.type?.name || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: 'Estado',
        filterVariant: 'select',
        accessorFn: originalRow => originalRow?.status?.name || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return (
            <Box sx={{ display: 'flex' }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={dataRow?.status?.color}
                sx={{ textTransform: 'capitalize' }}
              >
                {renderedCellValue}
              </Label>
            </Box>
          )
        }
      })
    ],
    [theme.palette.mode]
  )
}
