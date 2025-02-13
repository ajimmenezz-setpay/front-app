import { useMemo } from 'react'

import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material'

import { AccountColumn } from '../components/list/columns'
import { getColorStatusCommerceById } from '../services'

import { getOperationTypeByName } from '@/app/shared/services'
import { Label } from '@/shared/components/form'

export const useCommercesColumns = () =>
  useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Nombre',
        enableHiding: false,
        size: 150,
        Cell: ({ cell, column, row, renderedCellValue }) => (
          <Typography fontWeight={'bold'} variant="subtitle2">
            {renderedCellValue}
          </Typography>
        )
      },
      {
        id: 'legalRepresentative',
        accessorFn: originalRow => originalRow?.account?.name,
        header: 'Representante Legal',
        size: 100,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return <AccountColumn row={rowData} />
        }
      },
      {
        id: 'services',
        accessorFn: originalRow => originalRow?.services?.names?.toString(),
        header: 'Servicios',
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          const logos = []

          rowData?.services?.names?.forEach(service => {
            const serviceLogo = getOperationTypeByName(service)
            if (serviceLogo) {
              logos.push({
                component: serviceLogo?.component,
                name: service,
                width: service === 'NUBE' ? 20 : 25,
                height: service === 'NUBE' ? 20 : 25,
                color: service === 'NUBE' ? 'primary.main' : 'inherit'
              })
            }
          })

          return (
            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              gap={1}
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'double' }} />}
            >
              {logos?.length === 0 && (
                <Typography variant="subtitle2" fontWeight={'bold'} color={'warning.main'}>
                  {'Sin Servicios'}
                </Typography>
              )}
              {logos?.map(({ component: Logo, width, height, name, color }, index) => (
                <Tooltip title={name} key={index}>
                  <Box display={'flex'}>
                    <Logo sx={{ width, height, color }} />
                  </Box>
                </Tooltip>
              ))}
            </Stack>
          )
        }
      },
      {
        id: 'register-status',
        accessorFn: originalRow => originalRow?.status?.step,
        header: 'Estado Registro',
        minSize: 100,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return (
            <Stack sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <Typography
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                variant="subtitle2"
                title={renderedCellValue}
              >
                {renderedCellValue}
              </Typography>
            </Stack>
          )
        }
      },
      {
        id: 'status',
        accessorFn: originalRow => originalRow?.status?.name,
        header: 'Estado',
        size: 70,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return (
            <Stack>
              <Label
                size={'sm'}
                variant={'filled'}
                color={getColorStatusCommerceById(rowData?.status?.id)}
                sx={{
                  textTransform: 'uppercase'
                }}
              >
                {rowData?.status?.name}
              </Label>
            </Stack>
          )
        }
      }
    ],
    []
  )
