import { Stack, Typography } from '@mui/material'
import { BiBlock } from 'react-icons/bi'
import { BsPatchCheck } from 'react-icons/bs'

import { getCardTypeByName, getColorFundingOrderStatusByName, getOperationTypeByName } from '@/app/shared/services'
import { Label } from '@/shared/components/form'

export const FundingOrderColumns = [
  {
    accessorKey: 'referenceNumber', // access nested data with dot notation
    header: 'Referencia',
    enableHiding: false,
    size: 100
  },
  {
    accessorKey: 'paymentProcessorName', // access nested data with dot notation
    header: 'Cuenta',
    size: 100,
    filterVariant: 'multi-select',
    Cell: ({ cell, column, row }) => {
      const { original: rowData } = row

      const cardLogo = getCardTypeByName(rowData?.paymentProcessorName)
      const CardLogoComponent = cardLogo?.component
      return (
        <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
          {cardLogo && <CardLogoComponent sx={{ width: 30, height: 30 }} />}
        </Stack>
      )
    }
  },
  {
    accessorKey: 'amount', // access nested data with dot notation
    header: 'Monto',
    size: 100,
    Cell: ({ cell, column, row, renderedCellValue }) => (
      <Typography variant="subtitle2" fontWeight="bold">
        {renderedCellValue}
      </Typography>
    )
  },
  {
    accessorKey: 'date', // normal accessorKey
    header: 'Fecha',
    size: 100,
    Cell: ({ cell, column, row }) => {
      const { original: rowData } = row
      return (
        <Stack>
          <Typography variant="subtitle2">{rowData?.registerDate?.date}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {rowData?.registerDate?.time}
          </Typography>
        </Stack>
      )
    }
  },
  {
    accessorKey: 'paymentMethods', // access nested data with dot notation
    header: 'Método(s)',
    size: 120,
    filterVariant: 'multi-select',
    Cell: ({ cell, column, row }) => {
      const { original: rowData } = row
      const logos = []

      const paymentMethods = rowData?.paymentMethods?.split(',') || []

      paymentMethods?.forEach(method => {
        const methodLogo = getOperationTypeByName(method)
        if (methodLogo) {
          logos.push({
            component: methodLogo?.component,
            width: method === 'PAYCASH' ? 50 : 30,
            height: method === 'PAYCASH' ? 50 : 30
          })
        }
      })

      return (
        <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
          {logos?.map(({ component: Logo, width, height }, index) => (
            <Logo key={index} sx={{ width, height }} />
          ))}
        </Stack>
      )
    }
  },
  {
    accessorKey: 'status', // access nested data with dot notation
    header: 'Estado',
    filterVariant: 'multi-select',
    size: 100,
    Cell: ({ cell, column, row }) => {
      const { original: rowData } = row

      const color = getColorFundingOrderStatusByName(rowData?.status)

      return (
        <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
          <Label
            variant={'ghost'}
            color={color}
            sx={{
              textTransform: 'capitalize'
            }}
          >
            {rowData?.status}
          </Label>
        </Stack>
      )
    }
  },
  {
    accessorKey: 'conciliatedName', // access nested data with dot notation
    header: '¿Conciliada?',
    filterVariant: 'multi-select',
    size: 80,
    Cell: ({ cell, column, row }) => {
      const { original: rowData } = row

      return (
        <Stack
          flexDirection={'row'}
          width={1}
          justifyContent={'center'}
          alignItems={'center'}
          mr={2}
          gap={1}
          color={'primary'}
        >
          {rowData?.conciliated ? (
            <BsPatchCheck color="green" fontWeight={'bold'} fontSize={'18px'} />
          ) : (
            <BiBlock fontSize={'18px'} color="red" />
          )}
        </Stack>
      )
    }
  }
]
