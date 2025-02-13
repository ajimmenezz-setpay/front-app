import { useMemo } from 'react'

import { Box, Typography, useTheme } from '@mui/material'

import { getColorTicketStatusById } from '../services'

import { Label } from '@/shared/components/form'
import GetFontValue from '@/theme/utils/getFontValue'

export const useAssignedTicketsTableColumns = () => {
  const theme = useTheme()
  const { fontSize } = GetFontValue('caption')

  return useMemo(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'ID',
        enableHiding: false,
        size: 50,
        Cell: ({ cell, column, row, renderedCellValue }) => (
          <Typography fontWeight={'bold'} variant="subtitle2">
            {renderedCellValue}
          </Typography>
        )
      },
      {
        id: 'cause',
        accessorFn: originalRow => originalRow?.cause?.name || null,
        header: 'Causa',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Descripción',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      },
      {
        id: 'requester',
        header: 'Solicita',
        accessorKey: 'requester',
        maxSize: 200,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      },
      {
        id: 'status',
        accessorFn: originalRow => originalRow?.status?.name || null,
        header: 'Estado',
        maxSize: 120,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row

          return (
            <Box sx={{ display: 'flex', pt: 1 }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={getColorTicketStatusById(rowData?.status?.id) || 'primary'}
                sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap', fontSize }}
              >
                {rowData?.status?.name}
              </Label>
            </Box>
          )
        }
      },
      {
        id: 'date',
        accessorFn: originalRow => originalRow?.date?.original || null,
        header: 'Fecha',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return <Typography variant="subtitle2">{rowData?.date?.dateTime}</Typography>
        }
      }
    ],
    [theme.palette.mode]
  )
}
