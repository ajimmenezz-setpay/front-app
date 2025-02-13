import { CompareArrowsRounded } from '@mui/icons-material'
import {
  Box,
  Grid,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { ConciliateTerminalMovementsAdapter, TERMINALS_KEYS } from '../../../adapters'
import { useConciliateTerminalMovements, useFindMovementsToConciliateTerminal } from '../../../hooks'
import { useTerminalDetails } from '../../../store'

import { MaterialDataTable, SearchAction } from '@/shared/components/dataTables'
import { Modal } from '@/shared/components/modals'
import { Scrollbar } from '@/shared/components/scroll'
import { useMaterialTable } from '@/shared/hooks'
import { fCurrency } from '@/shared/utils'

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    backgroundColor: theme.palette.background.neutral
  }
}))

const ConciliateTerminalsMovements = () => {
  const setOpenConciliate = useTerminalDetails(state => state.setOpenConciliate)
  const openConciliate = useTerminalDetails(state => state.openConciliate)
  const setConciliateMovements = useTerminalDetails(state => state.setConciliateMovements)
  const { movements: terminalMovements, total, date } = useTerminalDetails(state => state.conciliateInfo)
  const terminal = useTerminalDetails(state => state.terminal)

  const {
    data: movements,
    error,
    isError,
    isFetching,
    isLoading: isLoadingMovements
  } = useFindMovementsToConciliateTerminal(terminal?.terminalId, date, { enabled: !!(terminal && date) })

  const { mutate, isLoading } = useConciliateTerminalMovements()

  const client = useQueryClient()

  const columns = [
    {
      id: 'card',
      header: `Movimientos Tarjeta Asociada`,
      columns: [
        {
          accessorKey: 'description',
          header: 'Movimiento',
          minSize: 100
        },
        {
          accessorKey: 'date',
          header: 'Fecha',
          size: 130
        },
        {
          accessorKey: 'amountFormat',
          header: 'Monto',
          minSize: 100
        }
      ]
    }
  ]

  const table = useMaterialTable(isError, error, {
    columns,
    data: movements?.movements || [],
    enableColumnPinning: true,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableFacetedValues: true,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    positionActionsColumn: 'last',
    enableDensityToggle: false,
    enableColumnResizing: false,
    initialState: {
      density: 'compact',
      sorting: [
        {
          id: 'date',
          desc: true
        }
      ]
    },
    state: {
      isLoading: isLoadingMovements,
      showAlertBanner: isError,
      showProgressBars: isFetching
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: theme => ({
        borderRadius: 0,
        backgroundColor: theme.palette.background.neutral
      })
    },
    muiBottomToolbarProps: {
      sx: theme => ({
        backgroundColor: theme.palette.background.neutral
      })
    },
    muiTopToolbarProps: {
      sx: theme => ({
        backgroundColor: theme.palette.background.neutral
      })
    },
    displayColumnDefOptions: {
      'mrt-row-select': {
        maxSize: 10,
        header: ''
      }
    },
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        <SearchAction table={table} />
      </Box>
    ),
    muiTableContainerProps: { sx: { maxHeight: 'md' } }
  })

  const selectedCardMovements = table?.getSelectedRowModel().flatRows?.map(row => row.original) ?? []

  const handleClose = () => {
    setOpenConciliate(false)
    setConciliateMovements(null)
    client.removeQueries({ queryKey: [TERMINALS_KEYS.CONCILIATE_MOVEMENTS, terminal?.terminalId] })
  }

  const handleSubmit = () => {
    if (selectedCardMovements?.length > 0) {
      const data = ConciliateTerminalMovementsAdapter(terminal, terminalMovements, selectedCardMovements[0])
      mutate(data, {
        onSuccess: () => {
          handleClose()
        },
        onError: () => {}
      })
    } else {
      toast.warn('Debe seleccionar un movimiento de la tarjeta para conciliar los movimientos de la terminal')
    }
  }
  return (
    <Modal
      onClose={handleClose}
      onSuccess={handleSubmit}
      isSubmitting={isLoading}
      fullWidth
      scrollType="body"
      title={`Conciliar Movimientos ${terminal?.name}`}
      textButtonSuccess="Conciliar"
      maxWidth="md"
      open={openConciliate}
    >
      <Stack pt={3}>
        <Grid container spacing={{ xs: 2 }}>
          <Grid item xs={12} md={5}>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 200 }}>
                <Table size="small">
                  <TableHead
                    sx={{
                      borderBottom: theme => `solid 1px ${theme.palette.divider}`
                    }}
                  >
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        Movimientos Terminal
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={40}>#</TableCell>
                      <TableCell align="left">Descripción</TableCell>
                      <TableCell align="right">Monto</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {terminalMovements?.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          borderBottom: theme => `solid 1px ${theme.palette.divider}`
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell align="left">
                          <Box sx={{ maxWidth: 180 }}>
                            <Typography variant="subtitle2">{row?.description}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                              {row?.transactionDate?.fullDate}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{fCurrency(row?.amount)}</TableCell>
                      </TableRow>
                    ))}

                    <RowResultStyle>
                      <TableCell colSpan={1} />
                      <TableCell align="right">
                        <Typography variant="h6">Total</Typography>
                      </TableCell>
                      <TableCell align="right" width={140}>
                        <Typography variant="h6">{fCurrency(total)}</Typography>
                      </TableCell>
                    </RowResultStyle>
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Grid>

          <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <CompareArrowsRounded fontSize="large" color="primary" />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <MaterialDataTable table={table} />
          </Grid>
        </Grid>
      </Stack>
    </Modal>
  )
}

export default ConciliateTerminalsMovements
