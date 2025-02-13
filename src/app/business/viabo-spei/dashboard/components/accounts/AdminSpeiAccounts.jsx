import { useEffect, useMemo } from 'react'

import PropTypes from 'prop-types'

import { Alert, Autocomplete, Box, CardContent, CardHeader, Divider, Stack, TextField, Typography } from '@mui/material'

import { STP_ACCOUNT_TYPES, getTitleAccountsByStpAccountType } from '../../../shared/constants'
import { useAdminDashboardSpeiStore } from '../../store'
import { AdminSpeiCardAccount } from '../balance/AdminsSpeiCardAccount'

import { CardViaboSpeiStyle } from '@/app/business/viabo-spei/shared/components'
import { CircularLoading } from '@/shared/components/loadings'

export const AdminSpeiAccounts = ({ isEmptyAccount, isLoading }) => {
  const {
    setOpenPayCommissions,
    setOpenSpeiOut,
    setOpenTransactions,
    stpAccounts,
    selectedAccount,
    setSelectedAccount
  } = useAdminDashboardSpeiStore()
  const setCompanies = useAdminDashboardSpeiStore(state => state.setCompanies)

  const title = useMemo(() => getTitleAccountsByStpAccountType(stpAccounts?.type), [stpAccounts])

  const handleChangeCompany = (e, newValue) => {
    setSelectedAccount(newValue)
  }

  const options = useMemo(() => {
    if (stpAccounts?.type === STP_ACCOUNT_TYPES.CONCENTRATOR) {
      return stpAccounts?.accounts || []
    }

    if (stpAccounts?.type === STP_ACCOUNT_TYPES.COST_CENTER) {
      return selectedAccount?.companies || []
    }
    return stpAccounts?.accounts || []
  }, [stpAccounts, selectedAccount])

  useEffect(() => {
    if (stpAccounts?.type === STP_ACCOUNT_TYPES.CONCENTRATOR) {
      return setCompanies(selectedAccount?.companies || [])
    }

    if (stpAccounts?.type === STP_ACCOUNT_TYPES.COST_CENTER) {
      return setCompanies(selectedAccount?.companies || [])
    }

    return setCompanies(stpAccounts?.accounts?.filter(account => account?.id !== selectedAccount?.id) || [])
  }, [stpAccounts, selectedAccount])

  return (
    <Box display={'flex'} component={CardViaboSpeiStyle} variant="outlined" flexDirection={'column'}>
      <CardHeader
        sx={{ p: 2 }}
        title={
          <Stack gap={1}>
            <Box>
              <Typography variant={'h6'}>{title || 'Cuentas'}</Typography>
            </Box>
            {stpAccounts?.accounts?.length > 1 && (
              <Stack flexGrow={1}>
                <Autocomplete
                  disableClearable
                  options={options || []}
                  fullWidth
                  size="small"
                  value={selectedAccount}
                  onChange={handleChangeCompany}
                  getOptionLabel={option => option?.label || ''}
                  getOptionDisabled={option => option?.isDisabled}
                  isOptionEqualToValue={(option, current) => option?.value === current?.value}
                  renderInput={params => (
                    <TextField
                      {...params}
                      placeholder="Seleccionar"
                      InputProps={{
                        ...params.InputProps
                      }}
                    />
                  )}
                />
              </Stack>
            )}
          </Stack>
        }
      />
      <Divider />
      <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isLoading && (
          <Stack justifyContent={'center'} alignItems={'center'}>
            <CircularLoading />
          </Stack>
        )}
        {isEmptyAccount && !isLoading && <Alert severity="info">No tienes {title} asignados</Alert>}
        {!isEmptyAccount && !isLoading && (
          <Box mb={2}>
            <AdminSpeiCardAccount stpAccount={selectedAccount} />
          </Box>
        )}
      </CardContent>
    </Box>
  )
}

AdminSpeiAccounts.propTypes = {
  isEmptyAccount: PropTypes.any,
  isLoading: PropTypes.any
}
