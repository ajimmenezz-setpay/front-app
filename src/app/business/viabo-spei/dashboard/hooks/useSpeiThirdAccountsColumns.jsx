import { useMemo } from 'react'

import { Stack, Typography } from '@mui/material'

export const useAdminSpeiMovementsColumns = () =>
  useMemo(
    () => [
      {
        id: 'company',
        accessorKey: 'company',
        header: 'No. Empresa',

        size: 150,
        Cell: ({ cell, column, row, renderedCellValue }) => (
          <Typography fontWeight={'bold'} variant="subtitle2">
            {renderedCellValue}
          </Typography>
        )
      },
      {
        id: 'beneficiary',
        enableHiding: false,
        accessorFn: originalRow => `${originalRow?.beneficiary?.name} ${originalRow?.beneficiary?.clabe}` || null,
        header: 'Cuenta',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return (
            <Stack>
              <Typography variant="subtitle2">{rowData?.beneficiary?.name}</Typography>
              <Typography variant="subtitle2" color={'text.secondary'}>
                {rowData?.beneficiary?.clabe}
              </Typography>
            </Stack>
          )
        }
      },
      {
        id: 'movement',
        accessorKey: 'movement',
        enableHiding: false,
        header: 'Movimiento',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      },
      {
        id: 'date',
        accessorFn: originalRow => originalRow?.date?.original || null,
        header: 'Fecha',
        minSize: 100,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return <Typography variant="subtitle2">{rowData?.date?.dateTime}</Typography>
        }
      },
      {
        id: 'type',
        accessorKey: 'type',
        header: 'Tipo',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      },
      {
        id: 'amount',
        enableHiding: false,
        accessorFn: originalRow => originalRow?.amount?.number || null,
        header: 'Monto',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return (
            <Typography
              fontWeight={'bold'}
              color={rowData?.amount?.color ? rowData?.amount?.color : 'text.primary'}
              variant="subtitle2"
            >
              {rowData?.amount?.format}
            </Typography>
          )
        }
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Estado',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }
    ],
    []
  )
