import { useEffect, useRef } from 'react'

import { ArrowBack } from '@mui/icons-material'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import { stringAvatar } from '@theme/utils'

import { ButtonViaboSpei } from '../../shared/components'
import { AdminSpeiAllTransactions } from '../components/movements/AdminSpeiAllTransactions'
import { useAdminDashboardSpeiStore } from '../store'

export const AdminDashboardSpeiTransactionsPage = () => {
  const setOpenTransactions = useAdminDashboardSpeiStore(state => state.setOpenTransactions)
  const selectedAccount = useAdminDashboardSpeiStore(state => state.selectedAccount)
  const ref = useRef(null)

  useEffect(() => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'instant' })
    }
  }, [])

  return (
    <Stack gap={3} ref={ref}>
      <Box>
        <ButtonViaboSpei
          variant="outlined"
          sx={{ color: 'text.primary' }}
          onClick={() => setOpenTransactions(false)}
          startIcon={<ArrowBack />}
        >
          Regresar
        </ButtonViaboSpei>
      </Box>

      <Stack flexDirection={'row'} gap={3} alignItems={'center'}>
        <Avatar {...stringAvatar(selectedAccount?.name || '')}></Avatar>
        <Stack>
          <Typography variant="subtitle1" color={'text.disabled'}>
            Cuenta {selectedAccount?.account?.hidden?.slice(-8)}
          </Typography>
          <Typography fontWeight={'bold'} sx={{ typography: 'h3' }}>
            {selectedAccount?.balance?.format}
          </Typography>
        </Stack>
      </Stack>
      <AdminSpeiAllTransactions />
    </Stack>
  )
}
