import { useMemo } from 'react'

import { Stack, Typography, useTheme } from '@mui/material'
import { createMRTColumnHelper } from 'material-react-table'

import { Label } from '@/shared/components/form'

export const useSpeiCloudCommissionsReportColumns = () => {
  const theme = useTheme()
  const columnHelper = createMRTColumnHelper()

  return useMemo(
    () => [
      columnHelper.accessor('reference', {
        id: 'reference',
        header: 'Referencia',
        enableHiding: false,
        maxSize: 100,
        accessorFn: originalRow => originalRow?.reference ?? null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Typography variant="subtitle2" color={'text.secondary'}>
              {renderedCellValue}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('trackingKey', {
        id: 'trackingKey',
        header: 'Clave de Rastreo',
        accessorFn: originalRow => originalRow?.trackingKey ?? null,
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
      columnHelper.accessor('type', {
        id: 'type',
        header: 'Tipo',
        maxSize: 100,
        filterVariant: 'multi-select',
        accessorFn: originalRow => originalRow?.type?.name ?? null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Label variant="ghost" color={dataRow?.type?.color}>
              <Typography variant="subtitle2" color={'text.secondary'}>
                {renderedCellValue}
              </Typography>
            </Label>
          )
        }
      }),
      columnHelper.accessor('concept', {
        id: 'concept',
        header: 'Concepto',
        enableHiding: false,
        accessorFn: originalRow => originalRow?.concept ?? null,
        minSize: 250,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }),

      columnHelper.accessor('sourceAccount', {
        id: 'sourceAccount',
        header: 'Origen',
        accessorFn: originalRow => originalRow?.sourceAccount?.complete ?? null,
        minSize: 150,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Stack>
              <Typography variant="subtitle2" color={'text.secondary'}>
                {dataRow?.sourceAccount?.name}
              </Typography>
              <Typography variant="subtitle2" color={'text.secondary'}>
                {dataRow?.sourceAccount?.number}
              </Typography>
            </Stack>
          )
        }
      }),
      columnHelper.accessor('destinationAccount', {
        id: 'destinationAccount',
        header: 'Destino',
        accessorFn: originalRow => originalRow?.destinationAccount?.complete ?? null,
        minSize: 150,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row
          return (
            <Stack>
              <Typography variant="subtitle2" color={'text.secondary'}>
                {dataRow?.destinationAccount?.name}
              </Typography>
              <Typography variant="subtitle2" color={'text.secondary'}>
                {dataRow?.destinationAccount?.number}
              </Typography>
            </Stack>
          )
        }
      }),

      columnHelper.accessor('amount', {
        id: 'amount',
        header: 'Monto',
        enableHiding: false,
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
            <Typography color={'text.primary'} fontWeight={'bold'} variant="subtitle2">
              {renderedCellValue}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('speiOut', {
        id: 'speiOut',
        header: 'SpeiOut',
        maxSize: 150,
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.commissions?.speiOut?.number || 0
          const amountB = rowB?.original?.commissions?.speiOut?.number || 0

          if (amountA < amountB) return -1
          if (amountA > amountB) return 1
          return 0
        },
        accessorFn: originalRow => originalRow?.commissions?.speiOut?.format || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }),
      columnHelper.accessor('speiIn', {
        id: 'speiIn',
        header: 'SpeiIn',
        maxSize: 150,
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.commissions?.speiIn?.number || 0
          const amountB = rowB?.original?.commissions?.speiIn?.number || 0

          if (amountA < amountB) return -1
          if (amountA > amountB) return 1
          return 0
        },
        accessorFn: originalRow => originalRow?.commissions?.speiIn?.format || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }),
      columnHelper.accessor('internal', {
        id: 'internal',
        header: 'Interna',
        maxSize: 150,
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.commissions?.internalTransfer?.number || 0
          const amountB = rowB?.original?.commissions?.internalTransfer?.number || 0

          if (amountA < amountB) return -1
          if (amountA > amountB) return 1
          return 0
        },
        accessorFn: originalRow => originalRow?.commissions?.internalTransfer?.format || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }),
      columnHelper.accessor('feeStp', {
        id: 'feeStp',
        header: 'Fee STP',
        maxSize: 150,
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.commissions?.fee?.number || 0
          const amountB = rowB?.original?.commissions?.fee?.number || 0

          if (amountA < amountB) return -1
          if (amountA > amountB) return 1
          return 0
        },
        accessorFn: originalRow => originalRow?.commissions?.fee?.format || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }),
      columnHelper.accessor('total', {
        id: 'total',
        header: 'Total',
        enableHiding: false,
        maxSize: 150,
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.total?.number || 0
          const amountB = rowB?.original?.total?.number || 0

          if (amountA < amountB) return -1
          if (amountA > amountB) return 1
          return 0
        },
        accessorFn: originalRow => originalRow?.total?.format || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }),
      columnHelper.accessor('date', {
        id: 'date',
        header: 'Fecha',
        enableHiding: false,
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
      })
    ],
    [theme.palette.mode]
  )
}
