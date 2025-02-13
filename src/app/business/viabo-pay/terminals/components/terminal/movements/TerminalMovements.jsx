import { useEffect, useMemo, useState } from 'react'

import { FileDownload } from '@mui/icons-material'
import { Alert, Box, Button, Card, Divider, IconButton, Paper, Stack, Tooltip } from '@mui/material'
import { isArray } from 'lodash'
import { toast } from 'react-toastify'

import { TerminalMovementColumns } from './TerminalMovementColumns'

import { useFindTerminalMovements } from '../../../hooks'
import { useTerminalDetails, useTerminals } from '../../../store'
import TerminalFilterCardType from '../TerminalFilterCardType'
import TerminalFilterStatus from '../TerminalFilterStatus'

import { CardFilterMovements } from '@/app/business/viabo-card/cards/components/details/movements/CardFilterMovements'
import {
  FiltersAction,
  FullScreenAction,
  MaterialDataTable,
  SearchAction,
  SearchGlobalTextField,
  ShowHideColumnsAction
} from '@/shared/components/dataTables'
import { useTabs } from '@/shared/hooks'
import { fCurrency, generateCSVFile, monthOptions } from '@/shared/utils'

export const TerminalMovements = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const terminal = useTerminalDetails(state => state.terminal)
  const setConciliateMovements = useTerminalDetails(state => state.setConciliateMovements)
  const setOpenConciliate = useTerminalDetails(state => state.setOpenConciliate)

  const setBalance = useTerminals(state => state.setBalance)
  const setGlobalBalance = useTerminals(state => state.setGlobalBalance)

  const { data, isFetching, refetch, isError, error, isLoading } = useFindTerminalMovements(
    terminal?.terminalId,
    currentMonth,
    { enabled: !!(terminal?.terminalId && currentMonth) }
  )

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Todos')

  const [filterCardType, setFilterCardType] = useState([])

  const [rowSelection, setRowSelection] = useState({})

  const { movements, amount } = useMemo(
    () =>
      applyFilter({
        movements: data?.movements || [],
        filterCardType,
        filterStatus
      }),
    [data?.movements, filterCardType, filterStatus]
  )

  const columns = useMemo(() => TerminalMovementColumns(terminal), [terminal])

  const handleChange = event => {
    const {
      target: { value }
    } = event
    setFilterCardType(typeof value === 'string' ? value.split(',') : value)
  }

  useEffect(() => {
    refetch()
    setRowSelection({})
  }, [currentMonth])

  useEffect(() => {
    setCurrentMonth(new Date())
  }, [terminal])

  useEffect(() => {
    if (amount && terminal && currentMonth) {
      setBalance({ month: monthOptions[currentMonth.getMonth()], amount })
    }
    if (amount && !terminal && currentMonth) {
      setGlobalBalance({ month: monthOptions[currentMonth.getMonth()], amount })
    }
  }, [amount, terminal, currentMonth])

  const handleExportRows = table => {
    try {
      const filterData =
        table.getSortedRowModel().rows.map(row => columns?.map(c => row.getValue(c.accessorKey)) || []) ?? []
      generateCSVFile(columns?.map(c => c.header) || [], filterData, 'Movimientos Terminales')
    } catch {}
  }

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'inherit' }}>
      <MaterialDataTable
        enableColumnPinning
        enableColumnFilterModes
        enableStickyHeader
        enableRowVirtualization
        enableFacetedValues
        enableRowSelection={row => {
          const { conciliated, approved } = row.original

          return !(Boolean(!approved && terminal) || Boolean(conciliated && terminal))
        }}
        enableDensityToggle={false}
        columns={columns}
        data={movements || []}
        isError={isError}
        textError={error}
        selectAllMode={'all'}
        onRowSelectionChange={setRowSelection}
        initialState={{
          density: 'compact',
          sorting: [
            {
              id: 'date',
              desc: true
            }
          ]
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          rowSelection: rowSelection ?? {}
        }}
        displayColumnDefOptions={{
          'mrt-row-select': {
            maxSize: 10
          }
        }}
        muiTableContainerProps={{ sx: { maxHeight: { md: '350px', lg: '450px', xl: '700px' } } }}
        renderTopToolbar={({ table }) => {
          const handleConciliate = () => {
            const selectedRows = table.getSelectedRowModel().flatRows?.map(selected => selected?.original)
            if (!terminal?.isExternalConciliation) {
              setConciliateMovements(selectedRows)
              setOpenConciliate(true)
            } else {
              toast.info('Conciliación Externa: En etapa de desarrollo 🧑🏻‍💻🚀!!')
            }
          }
          return (
            <Stack component={Paper} sx={{ backgroundColor: 'inherit' }}>
              <TerminalFilterStatus
                filterStatus={filterStatus}
                onChangeFilterStatus={onChangeFilterStatus}
                filters={data?.filters}
              />
              <Divider sx={{ borderStyle: 'dashed' }} />
              {isError && !isFetching && (
                <Alert
                  severity={'error'}
                  sx={{ width: 1, borderRadius: 0 }}
                  action={
                    <Button color="inherit" size="small" onClick={refetch}>
                      {'Recargar'}
                    </Button>
                  }
                >
                  {error}
                </Alert>
              )}
              <Stack
                direction={'row'}
                alignItems={'center'}
                flexWrap={'wrap'}
                justifyContent={'center'}
                flex={1}
                spacing={2}
                px={2}
                py={1}
              >
                <TerminalFilterCardType
                  cardType={filterCardType}
                  handleChangeCardType={handleChange}
                  isLoading={isFetching}
                />

                <Stack flexGrow={1}>
                  <CardFilterMovements
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    isLoading={isFetching}
                  />
                </Stack>
              </Stack>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Stack px={2} py={1} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                {terminal ? (
                  <Stack>
                    <Button
                      color="info"
                      onClick={handleConciliate}
                      disabled={table.getSelectedRowModel().flatRows?.length === 0}
                      variant="contained"
                    >
                      Conciliar
                    </Button>
                  </Stack>
                ) : (
                  <Box display={'flex'}></Box>
                )}
                <SearchGlobalTextField table={table} />

                <Box>
                  <SearchAction table={table} />
                  <Tooltip title="Descargar">
                    <IconButton
                      disabled={table.getPrePaginationRowModel().rows.length === 0}
                      onClick={() => handleExportRows(table)}
                    >
                      <FileDownload />
                    </IconButton>
                  </Tooltip>

                  <FiltersAction table={table} />
                  <ShowHideColumnsAction table={table} />
                  <FullScreenAction table={table} />
                </Box>
              </Stack>
            </Stack>
          )
        }}
        muiSelectCheckboxProps={({ row }) => {
          const { approved, conciliated } = row.original
          return {
            sx: {
              disabled: Boolean(!approved && terminal) || (conciliated && terminal),
              display: (!approved && terminal) || (conciliated && terminal) ? 'none' : 'flex'
            }
          }
        }}
      />
    </Card>
  )
}

function applyFilter({ movements, filterCardType, filterStatus }) {
  const stabilizedThis = movements?.map((el, index) => [el, index]) || []
  let amount = 0

  let tableData = stabilizedThis.map(el => el[0])

  if (filterStatus !== 'Todos') {
    tableData = tableData.filter(item => item.approved === (filterStatus === 'Aprobado'))
  }

  if (isArray(filterCardType) && filterCardType?.length > 0) {
    tableData = tableData.filter(item => filterCardType.includes(item?.cardType?.toUpperCase()))
  }

  amount = tableData.reduce((accumulator, transaction) => {
    if (transaction.approved) {
      const transactionAmount = parseFloat(transaction.amount)
      return accumulator + transactionAmount
    }
    return accumulator
  }, 0)

  return {
    movements: tableData ?? [],
    amount: fCurrency(amount.toFixed(2))
  }
}
