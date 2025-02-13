import { useMemo } from 'react'

import { Stack, Typography, useTheme } from '@mui/material'
import { createMRTColumnHelper } from 'material-react-table'

export const useCardCloudCardMovementsColumns = () => {
  const theme = useTheme()
  const columnHelper = createMRTColumnHelper()

  return useMemo(
    () => [
      columnHelper.accessor('description', {
        id: 'description',
        enableHiding: false,
        accessorFn: originalRow => originalRow?.description ?? null,
        header: 'Concepto',
        minSize: 400,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          if (dataRow?.authCode) {
            return (
              <Stack>
                <Typography variant="body2" fontWeight={600}>
                  {renderedCellValue}
                </Typography>
              </Stack>
            )
          }

          return (
            <Typography variant="body2" fontWeight={600}>
              {renderedCellValue}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('authCode', {
        id: 'authCode',
        header: 'Código de Autorización',
        maxSize: 150,
        accessorFn: originalRow => originalRow?.authCode ?? '',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return (
            <Typography variant="subtitle2" color={'text.secondary'}>
              {renderedCellValue}
            </Typography>
          )
        }
      }),

      columnHelper.accessor('amount', {
        id: 'amount',
        header: 'Monto',
        maxSize: 150,
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
            <Typography color={dataRow?.amount?.color || 'text.primary'} fontWeight={'bold'} variant="subtitle2">
              {renderedCellValue}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('balance', {
        id: 'balance',
        header: 'Balance',
        maxSize: 200,
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

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }),
      columnHelper.accessor('date', {
        id: 'date',
        header: 'Fecha',
        minSize: 150,
        accessorFn: originalRow => originalRow?.date?.dateTime ?? '',
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
