import { useMemo } from 'react'

import { Stack, Typography, useTheme } from '@mui/material'
import { createMRTColumnHelper } from 'material-react-table'

import { TicketCauseLabel } from '../../new-ticket-support/components/TicketCauseLabel'

export const useSupportTicketsColumns = () => {
  const theme = useTheme()
  const columnHelper = createMRTColumnHelper()

  return useMemo(
    () => [
      columnHelper.accessor('id', {
        id: 'id',
        header: 'ID',
        accessorFn: originalRow => originalRow?.id ?? '',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Typography variant="subtitle2" color={'text.secondary'}>
              {renderedCellValue}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('title', {
        id: 'title',
        header: 'Titulo',
        enableHiding: false,
        minSize: 250,
        accessorFn: originalRow => originalRow?.title ?? '',
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
      columnHelper.accessor('description', {
        id: 'description',
        header: 'Descripción',
        minSize: 300,
        accessorFn: originalRow => originalRow?.description ?? '',
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
        header: 'Estatus',
        enableHiding: false,
        filterVariant: 'multi-select',
        accessorFn: originalRow => originalRow?.status?.name ?? '',
        minSize: 250,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <TicketCauseLabel variant="ghost" color={dataRow?.status?.color}>
              {dataRow?.status?.name?.toUpperCase()}
            </TicketCauseLabel>
          )
        }
      }),
      columnHelper.accessor('createdAt', {
        id: 'createdAt',
        header: 'Fecha Creación',
        minSize: 250,
        accessorFn: originalRow => originalRow?.createdAt?.format ?? '',
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.createdAt?.original || 0
          const amountB = rowB?.original?.createdAt?.original || 0

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
      columnHelper.accessor('updatedAt', {
        id: 'updatedAt',
        header: 'Fecha Actualización',
        minSize: 250,
        accessorFn: originalRow => originalRow?.updatedAt?.format ?? '',
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.updatedAt?.original || 0
          const amountB = rowB?.original?.updatedAt?.original || 0

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
