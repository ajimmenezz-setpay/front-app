import { useEffect, useState } from 'react'

import { Contactless, GppGoodTwoTone } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, Stack, Typography } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { usePayConcentratorCommissions } from '../../../shared/hooks'
import { useAdminDashboardSpeiStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { Scrollbar } from '@/shared/components/scroll'

const PayCommissionsDrawer = () => {
  const { openPayCommissions: open, selectedAccount } = useAdminDashboardSpeiStore()
  const { setOpenPayCommissions } = useAdminDashboardSpeiStore()
  const { mutate, isLoading } = usePayConcentratorCommissions()

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClose = () => {
    setOpenPayCommissions(false)
  }

  const handleSubmit = () => {
    mutate(
      { account: selectedAccount?.account?.number?.toString() },
      {
        onSuccess: () => {
          handleClose()
        },
        onError: () => {}
      }
    )
  }

  return (
    <RightPanel
      open={open}
      handleClose={handleClose}
      titleElement={<Typography variant="h6">Enviar Comisiones</Typography>}
    >
      <>
        <Scrollbar>
          <Stack gap={3} flexDirection="column" alignItems={'center'} justifyContent={'center'} spacing={2} p={3}>
            <Stack flexDirection="column" alignItems={'center'} spacing={2}>
              <Contactless sx={{ width: 50, height: 50 }} color={'primary'} />
              <Stack alignItems={'center'} spacing={1}>
                <Typography variant="subtitle1">{`Se generará una transacción por`}</Typography>
                <Typography variant="h3">{`${selectedAccount?.commissions?.format}`}</Typography>
                <Typography variant="subtitle2">{`Pago de comisiones`}</Typography>
                <Typography variant="subtitle2">{`${selectedAccount?.account?.number}`}</Typography>
                <Typography variant="caption" color={'text.disabled'}>
                  {format(currentTime, 'dd MMM yyyy hh:mm:ss a', { locale: es })}
                </Typography>
              </Stack>
            </Stack>
            <Stack gap={3} width={1} sx={{ px: 5, pb: 5 }}>
              <LoadingButton
                size={'large'}
                onClick={handleSubmit}
                endIcon={<GppGoodTwoTone />}
                loading={isLoading}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ fontWeight: 'bold' }}
              >
                Enviar
              </LoadingButton>
              <Button onClick={handleClose} fullWidth variant="outlined" size="large">
                Cancelar
              </Button>
            </Stack>
          </Stack>
        </Scrollbar>
      </>
    </RightPanel>
  )
}

export default PayCommissionsDrawer
