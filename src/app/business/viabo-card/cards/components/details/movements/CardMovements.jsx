import { lazy, useCallback, useEffect, useMemo, useState } from 'react'

import { Check } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Card, MenuItem, Stack, Typography } from '@mui/material'
import { endOfDay, format, startOfDay, sub } from 'date-fns'
import { es } from 'date-fns/locale'
import { BiBlock } from 'react-icons/bi'
import { BsPatchCheck } from 'react-icons/bs'
import { LuReceipt } from 'react-icons/lu'
import { toast } from 'react-toastify'

import { MovementDescriptionColumn } from '@/app/business/shared/components/card-movements/columns'
import { CardMovementsHeader } from '@/app/business/shared/components/card-movements/header-filter'
import { useFindCardMovements } from '@/app/business/viabo-card/cards/hooks/useFindCardMovements'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { getOperationTypeByName } from '@/app/shared/services'
import { MaterialDataTable } from '@/shared/components/dataTables'
import { Lodable } from '@/shared/components/lodables'
import { useMaterialTable } from '@/shared/hooks'

const TransactionReport = Lodable(
  lazy(() => import('@/app/business/viabo-card/cards/components/details/incidence/TransactionReport'))
)

const VerifyExpensesDrawer = Lodable(
  lazy(() => import('@/app/business/shared/components/card-movements/verify-expenses/VerifyExpensesDrawer'))
)

const BalanceDrawer = Lodable(
  lazy(() => import('@/app/business/shared/components/card-movements/balance/BalanceDrawer'))
)

export function CardMovements() {
  const [openReport, setOpenReport] = useState(false)
  const [openVerifyExpenses, setOpenVerifyExpenses] = useState(false)
  const [openBalance, setOpenBalance] = useState(false)
  const [selectedMovement, setSelectedMovement] = useState(null)

  const card = useCommerceDetailsCard(state => state.card)
  const addInfoCard = useCommerceDetailsCard(state => state.addInfoCard)

  const currentDate = new Date()
  const initialStartDate = sub(currentDate, { days: 30 })
  const initialEndDate = currentDate
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)

  const { data, isLoading, refetch, isFetching, isError, error } = useFindCardMovements(card?.id, startDate, endDate, {
    enabled: false
  })

  const movements = data?.movements || []

  const columns = useMemo(
    () => [
      {
        accessorKey: 'description', // access nested data with dot notation
        header: 'Movimiento',
        enableHiding: false,
        minSize: 200,
        Cell: ({ cell, column, row }) => {
          const { original: rowData } = row
          return <MovementDescriptionColumn row={rowData} />
        }
      },
      {
        accessorKey: 'serverDate', // normal accessorKey
        header: 'Fecha',
        size: 120,
        Cell: ({ cell, column, row }) => {
          const { original: rowData } = row
          return (
            <Stack>
              <Typography variant="subtitle2">{rowData?.fullDate}</Typography>
            </Stack>
          )
        }
      },
      {
        accessorKey: 'operationType',
        header: 'Tipo',
        filterVariant: 'multi-select',
        size: 100,
        Cell: ({ cell, column, row }) => {
          const { original: rowData } = row
          const operationLogo = getOperationTypeByName(rowData?.operationType)
          const OperationLogoComponent = operationLogo?.component
          return (
            <Box>
              {operationLogo ? <OperationLogoComponent sx={{ width: 25, height: 25 }} /> : <LuReceipt size={22} />}
            </Box>
          )
        }
      },
      {
        accessorKey: 'amount',
        header: 'Monto',
        size: 100,
        Cell: ({ cell, column, row }) => {
          const { original: rowData } = row
          const isIncome = rowData?.type === 'ingreso'
          const isViaboPay = rowData?.type === 'terminal'
          return (
            <Typography variant="subtitle2" fontWeight="bold" color={isIncome || isViaboPay ? 'success.main' : 'error'}>
              {isIncome || isViaboPay ? `+ ${rowData?.amountFormat}` : `- ${rowData?.amountFormat}`}
            </Typography>
          )
        }
      },
      {
        accessorKey: 'verified',
        header: 'Comprobación',
        size: 80,
        Cell: ({ cell, column, row }) => {
          const { original: rowData } = row
          return (
            <Stack
              flexDirection={'row'}
              width={1}
              justifyContent={'center'}
              alignItems={'center'}
              gap={1}
              mr={2}
              color={'primary'}
            >
              {rowData?.verified ? (
                <BsPatchCheck color="green" fontWeight={'bold'} fontSize={'18px'} />
              ) : (
                <BiBlock fontSize={'18px'} color="red" />
              )}
            </Stack>
          )
        }
      }
    ],
    []
  )

  useEffect(() => {
    if (startDate && endDate) {
      refetch()
    }
  }, [startDate, endDate])

  useEffect(() => {
    setStartDate(initialStartDate)
    setEndDate(initialEndDate)
  }, [card?.id])

  useEffect(() => {
    if (data) {
      const filterDate = {
        startDate: startOfDay(startDate),
        endDate: endOfDay(endDate),
        text: `${format(startDate, 'dd MMMM yyyy', { locale: es })} - ${format(endDate, 'dd MMMM yyyy', {
          locale: es
        })}`
      }
      addInfoCard({ ...data, filterDate })
    }
  }, [data, card?.id, startDate, endDate])

  const table = useMaterialTable(isError, error, {
    columns,
    data: movements || [],
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    positionActionsColumn: 'last',
    enableDensityToggle: false,
    selectAllMode: 'all',
    initialState: {
      density: 'compact',
      sorting: [
        {
          id: 'serverDate',
          desc: true
        }
      ]
    },
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching
    },
    displayColumnDefOptions: {
      'mrt-row-select': {
        maxSize: 10
      },
      'mrt-row-actions': {
        header: 'Acciones',
        maxSize: 80
      }
    },
    muiTableContainerProps: { sx: { maxHeight: { md: '350px', lg: '450px', xl: '700px' } } },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <LoadingButton
          loading={isFetching}
          onClick={handleValidateExpenses(table)}
          disabled={handleValidateSamePaymentProcessor()}
          startIcon={<Check width={24} height={24} />}
          variant="outlined"
        >
          Comprobar
        </LoadingButton>
      </Box>
    ),
    renderRowActionMenuItems: ({ row, closeMenu }) => [
      <MenuItem
        key="incidence"
        onClick={() => {
          const { original: rowData } = row
          setSelectedMovement(rowData)
          closeMenu()
          setOpenReport(true)
        }}
      >
        Incidencia
      </MenuItem>
    ]
  })

  const selectedMovements = table?.getSelectedRowModel().flatRows?.map(row => row.original) ?? []

  const handleValidateSamePaymentProcessor = useCallback(() => {
    const firstPaymentProcessor = selectedMovements.length > 0 ? selectedMovements[0]?.paymentProcessor : null

    const result = Boolean(
      selectedMovements.every(obj => obj.paymentProcessor === firstPaymentProcessor) && table?.getIsSomeRowsSelected()
    )
    return !result
  }, [selectedMovements, table])

  const handleValidateExpenses = table => () => {
    const movements = table?.getSelectedRowModel().flatRows?.map(row => row.original) ?? []
    const someHasVerified = movements?.some(movement => movement?.verified)
    const someHasDifferentOperationType = movements?.some(movement => movement?.operationType !== 'OTROS CARGOS')
    if (someHasVerified) {
      return toast.warn(
        'Existen movimientos que ya se encuentran comprobados, verifique los movimientos seleccionados.'
      )
    }
    if (someHasDifferentOperationType) {
      return toast.warn('Existen movimientos que no se pueden comprobar, verifique el tipo de movimiento.')
    }

    return setOpenVerifyExpenses(true)
  }

  const handleDateRange = range => {
    const { startDate, endDate } = range
    if (endDate !== null && startDate !== null) {
      setEndDate(endDate)
      setStartDate(startDate)
    }
  }

  return (
    <>
      <Card>
        <CardMovementsHeader
          startDate={startDate}
          endDate={endDate}
          onChangeDateRange={handleDateRange}
          onOpenBalance={() => setOpenBalance(true)}
          loading={isFetching}
        />

        <MaterialDataTable table={table} />
      </Card>

      <TransactionReport open={openReport} setOpen={setOpenReport} selectedMovement={selectedMovement} />
      <VerifyExpensesDrawer
        open={openVerifyExpenses}
        setOpen={setOpenVerifyExpenses}
        movements={selectedMovements ?? []}
      />
      <BalanceDrawer
        open={openBalance}
        card={card}
        dateRange={card?.filterDate?.text}
        onClose={() => {
          setOpenBalance(false)
        }}
      />
    </>
  )
}
