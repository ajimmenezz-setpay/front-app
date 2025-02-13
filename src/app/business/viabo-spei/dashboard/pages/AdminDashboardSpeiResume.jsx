import { lazy } from 'react'

import { Grid, Stack } from '@mui/material'
import { useIsFetching } from '@tanstack/react-query'

import { VIABO_SPEI_SHARED_KEYS } from '../../shared/adapters'
import { AccountResumeBalance } from '../../shared/components/AccountResumeBalance'
import { AdminSpeiAccounts } from '../components/accounts/AdminSpeiAccounts'
import { useAdminDashboardSpeiStore } from '../store'

import { Lodable } from '@/shared/components/lodables'
import { useResponsive } from '@/theme/hooks'

const SpeiOutDrawer = Lodable(lazy(() => import('../components/spei-out/SpeiOutDrawer')))
const PayCommissionsDrawer = Lodable(lazy(() => import('../components/commissions/PayCommissionsDrawer')))
const AdminSpeiBalance = Lodable(lazy(() => import('../components/balance/AdminSpeiBalance')))
const AdminSpeiMovements = Lodable(lazy(() => import('../components/movements/AdminSpeiMovements')))
const SpeiAccountsActions = Lodable(lazy(() => import('../components/accounts/SpeiAccountsActions')))

export const AdminDashboardSpeiResume = () => {
  const setStpAccountsByPermissions = useAdminDashboardSpeiStore(state => state.setStpAccountsByPermissions)
  const selectedAccount = useAdminDashboardSpeiStore(state => state.selectedAccount)

  const isLoading = useIsFetching({ queryKey: [VIABO_SPEI_SHARED_KEYS.ACCOUNTS_INFO] }) === 1

  const isEmptyAccount = !isLoading && !selectedAccount
  const isDesktop = useResponsive('up', 'lg')

  return (
    <>
      <Stack gap={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={4}>
            <Stack gap={3}>
              <AdminSpeiAccounts isEmptyAccount={isEmptyAccount} isLoading={isLoading} />
              {!isDesktop && <SpeiAccountsActions isEmptyAccount={isEmptyAccount} isLoading={isLoading} />}
              <AccountResumeBalance
                setAccountsByPermissions={setStpAccountsByPermissions}
                originAccount={selectedAccount}
              />
              <AdminSpeiBalance />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} xl={8}>
            {isDesktop && <SpeiAccountsActions isEmptyAccount={isEmptyAccount} isLoading={isLoading} />}
            <AdminSpeiMovements isEmptyAccount={isEmptyAccount} />
          </Grid>
        </Grid>
      </Stack>

      <SpeiOutDrawer />
      <PayCommissionsDrawer />
    </>
  )
}
