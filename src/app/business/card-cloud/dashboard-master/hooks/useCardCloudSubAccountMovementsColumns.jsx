import { useMemo } from 'react'

import { Stack, Typography, useTheme } from '@mui/material'
import { createMRTColumnHelper } from 'material-react-table'

import { isEmpty } from '@/shared/utils'

export const useCardCloudSubAccountMovementsColumns = () => {
  const theme = useTheme()
  const columnHelper = createMRTColumnHelper()

  return useMemo(
    () => [
      columnHelper.accessor('date', {
        id: 'date',
        header: 'Fecha',
        minSize: 150,
        accessorFn: originalRow => originalRow?.date?.dateTime ?? null,
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
      }),
      columnHelper.accessor('description', {
        id: 'description',
        enableHiding: false,
        accessorFn: originalRow => originalRow?.description ?? null,
        header: 'Descripción',
        minSize: 400,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          if (dataRow?.authCode) {
            return (
              <Stack>
                <Typography variant="body2" fontWeight={600}>
                  {renderedCellValue}
                </Typography>
                <Typography variant="caption" color={'text.secondary'}>
                  {dataRow?.authCode}
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
      columnHelper.accessor('card', {
        id: 'card',
        header: 'Tarjeta',
        filterVariant: 'select',
        accessorFn: originalRow => (isEmpty(originalRow?.card?.bin) ? '' : originalRow?.card?.bin),
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return <Typography variant="subtitle2">{dataRow?.card?.hidden}</Typography>
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
        accessorFn: originalRow => originalRow?.amount?.format || null,
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
        accessorFn: originalRow => originalRow?.balance?.format || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      })
    ],
    [theme.palette.mode]
  )
}
