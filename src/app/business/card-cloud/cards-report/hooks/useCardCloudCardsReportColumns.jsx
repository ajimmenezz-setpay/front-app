import { useMemo } from 'react'

import { Stack, Typography, useTheme } from '@mui/material'
import { createMRTColumnHelper } from 'material-react-table'

import { Label } from '@/shared/components/form'

export const useCardCloudCardsReportColumns = () => {
  const theme = useTheme()
  const columnHelper = createMRTColumnHelper()

  return useMemo(
    () => [
      columnHelper.accessor('environment', {
        id: 'environment',
        header: 'Ambiente',
        accessorFn: originalRow => originalRow?.environment ?? '',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Typography variant="subtitle2" color={'text.secondary'}>
              {renderedCellValue}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('company', {
        id: 'company',
        header: 'Empresa',
        enableHiding: false,
        minSize: 250,
        filterVariant: 'multi-select',
        accessorFn: originalRow => originalRow?.company ?? '',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Stack>
              <Typography variant="subtitle2" color={'text.secondary'}>
                {renderedCellValue}
              </Typography>
            </Stack>
          )
        }
      }),
      columnHelper.accessor('clientId', {
        id: 'clientId',
        header: 'ClientId',
        filterVariant: 'multi-select',
        minSize: 250,
        accessorFn: originalRow => originalRow?.clientId ?? '',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Typography variant="subtitle2" color={'text.secondary'}>
              {renderedCellValue}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('card', {
        id: 'card',
        header: 'Tarjeta',
        enableHiding: false,
        accessorFn: originalRow => originalRow?.maskedPan ?? '',
        minSize: 250,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }} variant="subtitle2">
              {renderedCellValue}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('type', {
        id: 'type',
        header: 'Tipo',
        minSize: 250,
        filterVariant: 'multi-select',
        accessorFn: originalRow => originalRow?.type ?? '',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Typography variant="subtitle2" color={'text.secondary'}>
              {renderedCellValue}
            </Typography>
          )
        }
      }),

      columnHelper.accessor('status', {
        id: 'status',
        header: 'Estado',
        minSize: 250,
        filterVariant: 'multi-select',
        accessorFn: originalRow => originalRow?.status?.name ?? '',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Label variant="ghost" color={dataRow?.status?.color || 'default'}>
              {renderedCellValue}
            </Label>
          )
        }
      }),

      columnHelper.accessor('balance', {
        id: 'balance',
        header: 'Balance',
        enableHiding: false,
        minSize: 250,
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.balance?.number || 0
          const amountB = rowB?.original?.balance?.number || 0

          if (amountA < amountB) return -1
          if (amountA > amountB) return 1
          return 0
        },
        accessorFn: originalRow => originalRow?.balance?.format ?? '',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return (
            <Typography
              sx={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
              color={dataRow?.balance?.color || 'text.primary'}
              fontWeight={'bold'}
              variant="subtitle2"
            >
              {renderedCellValue}
            </Typography>
          )
        }
      }),

      columnHelper.accessor('activationDate', {
        id: 'activationDate',
        header: 'Fecha de Activación',
        minSize: 250,
        accessorFn: originalRow => originalRow?.activationDate?.format ?? '',
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.activationDate?.original || 0
          const amountB = rowB?.original?.activationDate?.original || 0

          if (amountA < amountB) return -1
          if (amountA > amountB) return 1
          return 0
        },
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Typography variant="subtitle2" color={'text.secondary'}>
              {renderedCellValue}
            </Typography>
          )
        }
      })
    ],
    [theme.palette.mode]
  )
}
