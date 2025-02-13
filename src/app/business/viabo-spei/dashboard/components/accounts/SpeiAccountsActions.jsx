import React from 'react'

import { Box, Button, Divider, Skeleton, Stack } from '@mui/material'
import { TbCreditCardPay, TbReportMoney } from 'react-icons/tb'
import { toast } from 'react-toastify'

import { SpeiBillingReportMenu } from './SpeiBillingReportMenu'

import { useAdminDashboardSpeiStore } from '../../store'

const SpeiAccountsActions = ({ isEmptyAccount, isLoading }) => {
  const { setOpenPayCommissions, setOpenSpeiOut, setOpenTransactions, selectedAccount } = useAdminDashboardSpeiStore()

  return (
    <Box mb={{ md: 2 }}>
      {isLoading && (
        <Stack>
          <Stack
            gap={3}
            flexDirection="row"
            justifyContent={'space-evenly'}
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
          >
            <Skeleton width={140} height={80} />
            <Skeleton width={140} height={80} />
            <Skeleton width={140} height={80} />
          </Stack>
        </Stack>
      )}
      {!isEmptyAccount && !isLoading && (
        <Box sx={{ overflowX: 'auto', scrollBehavior: 'smooth', scrollPadding: 20 }}>
          <Stack
            flexDirection="row"
            justifyContent={'space-evenly'}
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            gap={3}
            pb={1}
            sx={{ scrollSnapAlign: 'end', scrollMargin: 20 }}
          >
            <Stack>
              <Button
                size="large"
                variant="outlined"
                sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
                onClick={() => setOpenSpeiOut(true)}
                startIcon={<TbCreditCardPay style={{ fontSize: 18 }} />}
              >
                Transferir
              </Button>
            </Stack>

            {selectedAccount?.isSubAccount && (
              <Stack>
                <Button
                  size="large"
                  variant="outlined"
                  fullWidth
                  sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    if (selectedAccount?.commissions.number <= 0) {
                      return toast.warning(
                        `No hay comisiones que pagar ${selectedAccount?.commissions?.format || '$0.00'}`
                      )
                    }

                    return setOpenPayCommissions(true)
                  }}
                  startIcon={<TbReportMoney style={{ fontSize: 18 }} />}
                >
                  Pagar Comisiones
                </Button>
              </Stack>
            )}

            <SpeiBillingReportMenu speiAccount={selectedAccount} />
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default SpeiAccountsActions
