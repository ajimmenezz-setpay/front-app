import React, { useMemo } from 'react'

import PropTypes from 'prop-types'

import { Alert, Box, Button, CardHeader, Divider, LinearProgress, Stack, alpha } from '@mui/material'
import { TbReportAnalytics } from 'react-icons/tb'

import { AdminSpeiLastMovements } from './AdminSpeiLastMovements'

import { getTitleAccountsByStpAccountType } from '../../../shared/constants'
import { useAdminDashboardSpeiStore } from '../../store'

import { CardViaboSpeiStyle } from '@/app/business/viabo-spei/shared/components'
import { useFindViaboSpeiMovements } from '@/app/business/viabo-spei/shared/hooks'
import { Label } from '@/shared/components/form'

const AdminSpeiMovements = ({ isEmptyAccount }) => {
  const { setOpenTransactions } = useAdminDashboardSpeiStore()
  const selectedAccount = useAdminDashboardSpeiStore(state => state.selectedAccount)
  const stpAccounts = useAdminDashboardSpeiStore(state => state.stpAccounts)
  const queryMovements = useFindViaboSpeiMovements(
    { limit: 10, account: selectedAccount?.account?.number },
    { enabled: !!selectedAccount?.account?.number }
  )
  const { isLoading, data: movements, isFetching } = queryMovements
  const title = useMemo(() => getTitleAccountsByStpAccountType(stpAccounts?.type), [stpAccounts])

  return (
    <Box
      component={CardViaboSpeiStyle}
      variant="outlined"
      sx={theme => ({
        backdropFilter: `blur(10px)`,
        WebkitBackdropFilter: `blur(10px)`
      })}
    >
      <CardHeader
        sx={{ p: 2 }}
        title={
          <Stack flexDirection={{ md: 'row' }} gap={2} justifyContent={'space-between'} alignItems={{ md: 'center' }}>
            <Stack>
              Últimas Transacciones
              <Box>
                <Label variant={'ghost'} color={'warning'}>
                  Movimiento con comisiones
                </Label>
              </Box>
            </Stack>
            <Stack>
              <Button
                size="large"
                variant="outlined"
                fullWidth
                sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
                onClick={() => setOpenTransactions(true)}
                startIcon={<TbReportAnalytics style={{ fontSize: 18 }} />}
              >
                Detalles Movimientos
              </Button>
            </Stack>
          </Stack>
        }
      />
      <Divider sx={{ borderColor: alpha('#CFDBD5', 0.7) }} />
      <Stack>
        {isFetching && <LinearProgress />}
        {isEmptyAccount ? (
          <Stack pt={3} px={3}>
            <Alert severity="info">No tienes {title} asignados</Alert>
          </Stack>
        ) : (
          <Stack flexDirection={'row'} sx={{ height: '100%', display: 'flex', flexGrow: 1 }}>
            <AdminSpeiLastMovements movementsGrouped={movements?.groupByDay} isLoading={isLoading} />
          </Stack>
        )}
        {isFetching && <LinearProgress />}
      </Stack>
    </Box>
  )
}

AdminSpeiMovements.propTypes = {
  isEmptyAccount: PropTypes.any
}

export default AdminSpeiMovements
