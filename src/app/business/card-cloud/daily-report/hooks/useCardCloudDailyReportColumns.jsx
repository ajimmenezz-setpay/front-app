import { useMemo } from 'react'

import { Stack, Typography, useTheme } from '@mui/material'
import { createMRTColumnHelper } from 'material-react-table'

export const useCardCloudDailyReportColumns = () => {
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
        accessorFn: originalRow => originalRow?.card?.clientId ?? '',
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
        filterVariant: 'multi-select',
        accessorFn: originalRow => originalRow?.card?.maskedPan ?? '',
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
      columnHelper.accessor('concept', {
        id: 'concept',
        header: 'Concepto',
        accessorFn: originalRow => originalRow?.description ?? '',
        minSize: 250,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Typography variant="subtitle2" sx={{ textWrap: 'balance' }}>
              {renderedCellValue}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('authCode', {
        id: 'authCode',
        header: 'Código de Autorización',
        accessorFn: originalRow => originalRow?.authCode ?? '',
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

      columnHelper.accessor('amount', {
        id: 'amount',
        header: 'Monto',
        enableHiding: false,
        minSize: 250,
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.amount?.number || 0
          const amountB = rowB?.original?.amount?.number || 0

          if (amountA < amountB) return -1
          if (amountA > amountB) return 1
          return 0
        },
        accessorFn: originalRow => originalRow?.amount?.format ?? '',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return (
            <Typography
              sx={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}
              color={dataRow?.amount?.color || 'text.primary'}
              fontWeight={'bold'}
              variant="subtitle2"
            >
              {renderedCellValue}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('date', {
        id: 'date',
        header: 'Fecha',
        enableHiding: false,
        minSize: 250,
        accessorFn: originalRow => originalRow?.date?.format ?? '',
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.date?.original || 0
          const amountB = rowB?.original?.date?.original || 0

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
