import { useMemo } from 'react'

import { Box, Typography } from '@mui/material'

import { contrastColor } from '@/theme/utils'

export const useCausesColumns = () =>
  useMemo(
    () => [
      {
        id: 'cause',
        accessorKey: 'cause',
        header: 'Causa',
        enableHiding: false,
        size: 150,
        Cell: ({ cell, column, row, renderedCellValue }) => (
          <Typography fontWeight={'bold'} variant="subtitle2">
            {renderedCellValue}
          </Typography>
        )
      },
      {
        id: 'requesterProfile',
        accessorFn: originalRow => originalRow?.requesterProfile?.name || null,
        header: 'Perfil Solicitante',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      },
      {
        id: 'receptorProfile',
        accessorFn: originalRow => originalRow?.receptorProfile?.name || null,
        header: 'Perfil Receptor',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row

          return <Typography variant="subtitle2">{renderedCellValue}</Typography>
        }
      },
      {
        id: 'color',
        accessorKey: 'color',
        header: 'Color',
        minSize: 100,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          const styles = theme => ({
            height: 'auto',
            minHeight: 22,
            minWidth: 22,
            borderRadius: 8,
            cursor: 'default',
            alignItems: 'center',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            display: 'inline-flex',
            justifyContent: 'center',
            padding: theme.spacing(0, 1),
            color: contrastColor(renderedCellValue),
            fontSize: theme.typography.pxToRem(12),
            fontFamily: theme.typography.fontFamily,
            backgroundColor: renderedCellValue,
            fontWeight: theme.typography.fontWeightBold
          })

          return (
            <Box sx={{ display: 'flex', pt: 1 }}>
              <Box component="span" sx={styles}>
                {renderedCellValue}
              </Box>
            </Box>
          )
        }
      }
    ],
    []
  )
