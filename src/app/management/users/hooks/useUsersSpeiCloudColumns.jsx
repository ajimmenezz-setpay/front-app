import { useMemo } from 'react'

import { Typography } from '@mui/material'
import { createMRTColumnHelper } from 'material-react-table'

import { UserCompaniesColumn } from '../components/users-by-spei-cloud/UserCompaniesColumn'

export const useUsersSpeiCloudColumns = () => {
  const columnHelper = createMRTColumnHelper()
  return useMemo(
    () => [
      columnHelper.accessor('id', {
        id: 'id',
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false,
        minSize: 100
      }),
      columnHelper.accessor('firstName', {
        id: 'firstName',
        accessorKey: 'firstName',
        header: 'Nombre',
        enableHiding: false,
        Cell: ({ cell, column, row, renderedCellValue }) => (
          <Typography textTransform={'capitalize'} fontWeight={'bold'} variant="subtitle2">
            {renderedCellValue}
          </Typography>
        )
      }),
      columnHelper.accessor('lastName', {
        id: 'lastName',
        accessorKey: 'lastName',
        header: 'Apellido(s)'
      }),
      columnHelper.accessor('email', {
        id: 'email',
        accessorKey: 'email',
        header: 'Correo',
        minSize: 250
      }),
      columnHelper.accessor('phone', {
        id: 'phone',
        accessorKey: 'phone',
        header: 'Teléfono'
      }),

      columnHelper.accessor('companies', {
        id: 'companies',
        header: 'Empresas',
        accessorFn: originalRow => originalRow?.companies?.names ?? null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return <UserCompaniesColumn row={rowData} />
        }
      }),
      columnHelper.accessor('lastSession', {
        id: 'lastSession',
        header: 'Última Sesión',
        enableHiding: false,
        minSize: 150,
        accessorFn: originalRow => originalRow?.lastSessionDate?.dateTime ?? null,
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.lastSessionDate?.original || 0
          const amountB = rowB?.original?.lastSessionDate?.original || 0

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
      columnHelper.accessor('date', {
        id: 'date',
        header: 'Fecha de Creación',
        enableHiding: false,
        minSize: 150,
        accessorFn: originalRow => originalRow?.createDate?.dateTime ?? null,
        sortingFn: (rowA, rowB, columnId) => {
          const amountA = rowA?.original?.createDate?.original || 0
          const amountB = rowB?.original?.createDate?.original || 0

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
    []
  )
}
