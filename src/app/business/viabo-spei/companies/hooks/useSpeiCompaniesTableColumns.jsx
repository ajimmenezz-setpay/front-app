import { useMemo } from 'react'

import { Typography } from '@mui/material'
import { createMRTColumnHelper } from 'material-react-table'

export const useSpeiCompaniesTableColumns = () => {
  const columnHelper = createMRTColumnHelper()
  return useMemo(
    () => [
      {
        id: 'folio',
        accessorKey: 'folio',
        header: 'ID',
        enableHiding: false,
        maxSize: 50,
        Cell: ({ cell, column, row, renderedCellValue }) => (
          <Typography variant="subtitle2">{renderedCellValue}</Typography>
        )
      },
      {
        id: 'rfc',
        accessorKey: 'rfc',
        header: 'RFC',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return (
            <Typography textTransform={'uppercase'} variant="subtitle2">
              {renderedCellValue}
            </Typography>
          )
        }
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
      columnHelper.accessor('stpAccount', {
        id: 'stpAccount',
        header: 'Cuenta STP',
        enableClickToCopy: true,
        accessorFn: originalRow => originalRow?.account?.complete || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row

          return <Typography variant="subtitle2">{rowData?.account?.hidden}</Typography>
        }
      }),
      {
        id: 'balance',
        accessorKey: 'balance',
        header: 'Balance',
        minSize: 100,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      }
    ],
    []
  )
}
