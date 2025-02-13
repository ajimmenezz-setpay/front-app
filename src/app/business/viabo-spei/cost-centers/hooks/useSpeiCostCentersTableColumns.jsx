import { useMemo } from 'react'

import { Typography } from '@mui/material'

export const useSpeiCostCentersTableColumns = () =>
  useMemo(
    () => [
      {
        id: 'id',
        accessorKey: 'folio',
        header: 'ID',
        enableHiding: false,
        maxSize: 40,
        Cell: ({ cell, column, row, renderedCellValue }) => (
          <Typography variant="subtitle2">{renderedCellValue}</Typography>
        )
      },

      {
        id: 'name',
        accessorKey: 'name',
        header: 'Nombre',
        enableHiding: false,
        Cell: ({ cell, column, row, renderedCellValue }) => (
          <Typography textTransform={'capitalize'} fontWeight={'bold'} variant="subtitle2">
            {renderedCellValue}
          </Typography>
        )
      },

      {
        id: 'companies',
        header: 'Empresas',
        accessorKey: 'companies',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }
    ],
    []
  )
