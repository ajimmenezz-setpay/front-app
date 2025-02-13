import { WarningAmberOutlined } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'

import { useCancelFundingOrder } from '../hooks'
import { useFundingOrderStore } from '../store'

import { ModalAlert } from '@/shared/components/modals'

const CancelFundingOrder = () => {
  const setFundingOrder = useFundingOrderStore(state => state.setFundingOrder)
  const fundingOrder = useFundingOrderStore(state => state.fundingOrder)
  const setOpenCancelFundingOrder = useFundingOrderStore(state => state.setOpenCancelFundingOrder)
  const openCancelFundingOrder = useFundingOrderStore(state => state.openCancelFundingOrder)

  const { mutate, isLoading } = useCancelFundingOrder()

  const handleClose = () => {
    setOpenCancelFundingOrder(false)
    setFundingOrder(null)
  }

  const handleSuccess = () => {
    handleClose()
    mutate({ id: fundingOrder?.id })
  }

  return (
    <ModalAlert
      title="Cancelar Orden de Fondeo"
      typeAlert="warning"
      textButtonSuccess="Si, estoy de acuerdo"
      onClose={handleClose}
      open={openCancelFundingOrder}
      isSubmitting={isLoading}
      description={
        <Stack spacing={2}>
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <WarningAmberOutlined />
            <Typography>¿Está seguro de cancelar esta orden de fondeo?</Typography>
          </Stack>
        </Stack>
      }
      onSuccess={handleSuccess}
      fullWidth
      maxWidth="xs"
    />
  )
}

export default CancelFundingOrder
