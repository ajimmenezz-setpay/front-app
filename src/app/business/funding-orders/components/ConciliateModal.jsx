import { Alert, Box, Card, Stack, Typography } from '@mui/material'
import { toast } from 'react-toastify'

import { ConciliateFundingOrderAdapter } from '../adapters'
import { useConciliateFundingOrder, useFindConciliateMovementsByOrder } from '../hooks'
import { useFundingOrderStore } from '../store'

import { getCardTypeByName } from '@/app/shared/services'
import { MaterialDataTable, SearchAction } from '@/shared/components/dataTables'
import { Modal } from '@/shared/components/modals'
import { useMaterialTable } from '@/shared/hooks'

const ConciliateModal = () => {
  const openConciliateModal = useFundingOrderStore(state => state.openConciliateModal)
  const setOpenConciliateModal = useFundingOrderStore(state => state.setOpenConciliateModal)
  const fundingOrder = useFundingOrderStore(state => state.fundingOrder)
  const setFundingOrder = useFundingOrderStore(state => state.setFundingOrder)
  const { mutate, isLoading } = useConciliateFundingOrder()

  const columns = [
    {
      accessorKey: 'description', // access nested data with dot notation
      header: 'Movimiento',
      size: 100
    },
    {
      accessorKey: 'date', // access nested data with dot notation
      header: 'Fecha',
      size: 100
    },
    {
      accessorKey: 'amountFormat', // access nested data with dot notation
      header: 'Monto',
      size: 100
    }
  ]

  const {
    data: movements,
    isError,
    error,
    isLoading: isLoadingMovements,
    isFetching
  } = useFindConciliateMovementsByOrder(fundingOrder, {
    enabled: !!fundingOrder
  })

  const cardLogo = getCardTypeByName(fundingOrder?.paymentProcessorName)
  const CardLogoComponent = cardLogo?.component

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

  const selectedMovements = table?.getSelectedRowModel().flatRows?.map(row => row.original) ?? []

  const handleSubmit = () => {
    if (selectedMovements?.length > 0) {
      const data = ConciliateFundingOrderAdapter(fundingOrder, selectedMovements[0])
      mutate(data, {
        onSuccess: () => {
          handleClose()
        },
        onError: () => {}
      })
    } else {
      toast.warn('Debe seleccionar un movimiento para conciliar la orden de fondeo')
    }
  }

  const handleClose = () => {
    setOpenConciliateModal(false)
    setFundingOrder(null)
  }

  return (
    <Modal
      onClose={handleClose}
      onSuccess={handleSubmit}
      isSubmitting={isLoading}
      fullWidth
      scrollType="body"
      title={'Conciliar'}
      textButtonSuccess="Conciliar"
      open={openConciliateModal}
    >
      <Stack spacing={3} sx={{ py: 3 }}>
        <Alert
          severity="info"
          sx={{
            display: 'flex',
            flexGrow: 1,
            '& .MuiAlert-message': { display: 'flex', flexGrow: 1 }
          }}
        >
          <Stack flexGrow={1} spacing={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Stack>
              <Typography variant="subtitle2">Orden #{fundingOrder?.referenceNumber}</Typography>
              <Typography variant="subtitle2" fontWeight={'bold'}>
                {fundingOrder?.amount}
              </Typography>
            </Stack>
            <Stack>{cardLogo && <CardLogoComponent sx={{ width: 30, height: 30 }} />}</Stack>
          </Stack>
        </Alert>
        <Stack>
          <Card>
            <MaterialDataTable table={table} />
          </Card>
        </Stack>
      </Stack>
    </Modal>
  )
}

export default ConciliateModal
