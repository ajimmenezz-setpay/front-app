import { AccountBalance, Check, Clear } from '@mui/icons-material'
import { Avatar, Box, Stack, Tooltip, Typography } from '@mui/material'
import { BiBlock } from 'react-icons/bi'
import { BsPatchCheck } from 'react-icons/bs'

import { getCardTypeByName } from '@/app/shared/services'

export const TerminalMovementColumns = terminal => [
  {
    id: 'terminal',
    header: `${terminal ? terminal?.name : 'Global'}`,
    columns: [
      {
        accessorKey: 'description', // access nested data with dot notation
        header: 'Movimiento',
        enableHiding: false,
        size: 200,
        Cell: ({ cell, column, row }) => {
          const { original: rowData } = row

          const approved = rowData?.approved
          const cardLogo = getCardTypeByName(rowData?.cardType)
          const CardLogoComponent = cardLogo?.component
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <Tooltip title={rowData?.cardType}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      color: 'text.secondary',
                      bgcolor: 'background.neutral'
                    }}
                  >
                    {cardLogo ? (
                      <CardLogoComponent sx={{ width: 25, height: 25 }} />
                    ) : (
                      <AccountBalance width={25} height={25} />
                    )}
                  </Avatar>
                </Tooltip>
                <Box
                  sx={{
                    right: 0,
                    bottom: 0,
                    width: 15,
                    height: 15,
                    display: 'flex',
                    borderRadius: '50%',
                    position: 'absolute',
                    alignItems: 'center',
                    color: 'common.white',
                    bgcolor: 'error.main',
                    justifyContent: 'center',
                    ...(approved && {
                      bgcolor: 'success.main'
                    })
                  }}
                >
                  {approved ? <Check sx={{ width: 12, height: 12 }} /> : <Clear sx={{ width: 12, height: 12 }} />}
                </Box>
              </Box>
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ textWrap: 'wrap' }}>
                  {rowData?.description}
                </Typography>
                <Typography
                  variant="body2"
                  textTransform={'capitalize'}
                  sx={{ color: approved ? 'success.main' : 'error.main', textWrap: 'wrap' }}
                >
                  {rowData?.transactionMessage}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      ...(terminal
        ? []
        : [
            {
              accessorKey: 'terminalName', // access nested data with dot notation
              header: 'Terminal',
              size: 100,

              Cell: ({ cell, column, row, renderedCellValue }) => {
                const { original: rowData } = row
                return (
                  <Typography variant="subtitle2" fontWeight="bold">
                    {rowData?.terminalName}
                  </Typography>
                )
              }
            }
          ]),
      {
        accessorKey: 'date', // access nested data with dot notation
        header: 'Fecha',
        size: 100,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: rowData } = row
          return (
            <Stack>
              <Typography variant="subtitle2">{rowData?.transactionDate?.date}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {rowData?.transactionDate?.time}
              </Typography>
            </Stack>
          )
        }
      },
      {
        accessorKey: 'amountFormat', // access nested data with dot notation
        header: 'Monto',
        size: 100,
        Cell: ({ cell, column, row }) => {
          const { original: rowData } = row
          return (
            <Typography variant="subtitle2" fontWeight="bold">
              {rowData?.amountFormat}
            </Typography>
          )
        }
      },
      {
        accessorKey: 'conciliatedName', // access nested data with dot notation
        header: '¿Conciliada?',
        filterVariant: 'multi-select',
        size: 110,
        Cell: ({ cell, column, row }) => {
          const { original: rowData } = row

          return (
            <Stack flexDirection={'row'} gap={1} color={'primary'}>
              {rowData?.conciliated ? (
                <BsPatchCheck color="green" fontWeight={'bold'} fontSize={'20px'} />
              ) : (
                <BiBlock fontSize={'20px'} color="red" />
              )}
            </Stack>
          )
        }
      }
    ]
  }
]
