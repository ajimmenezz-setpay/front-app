import { useEffect } from 'react'

import { Box, Stack, Typography } from '@mui/material'

import { STP_ACCOUNT_TYPES } from '../constants'
import { useFindViaboSpeiAccountsInfo } from '../hooks'

import { useUser } from '@/shared/hooks'

export const AccountResumeBalance = ({ originAccount, setAccountsByPermissions }) => {
  const { permissions } = useUser()
  const { data } = useFindViaboSpeiAccountsInfo()

  const isConcentrator = Boolean(originAccount?.type === STP_ACCOUNT_TYPES.CONCENTRATOR)

  useEffect(() => {
    if (data) {
      setAccountsByPermissions(data, permissions)
    }
  }, [data, permissions])

  return (
    <Stack gap={isConcentrator ? 1 : 0}>
      <Stack>
        <Typography variant="subtitle1" sx={{ color: 'success.main', fontWeight: 'bold' }}>
          Saldo Disponible
        </Typography>
        <Typography sx={{ typography: 'h2' }}>
          {isConcentrator ? originAccount?.balance?.format || '$0.00' : originAccount?.totalBalance?.format || '$0.00'}
        </Typography>
        {isConcentrator && (
          <Typography sx={{ typography: 'subtitle2' }}>
            Última Actualización: <Box component={'span'}>{originAccount?.balanceDate?.format}</Box>
          </Typography>
        )}
      </Stack>

      {isConcentrator && (
        <Stack>
          <Typography sx={{ typography: 'subtitle2' }}>
            Saldo en Empresas:{' '}
            <Box component={'span'} color={'error.main'} fontWeight={'bold'}>
              {originAccount?.companiesBalance?.format || '$0.00'}
            </Box>
          </Typography>
          <Typography sx={{ typography: 'subtitle2' }}>
            Saldo en Centro de Costos:{' '}
            <Box component={'span'} color={'info.main'} fontWeight={'bold'}>
              {originAccount?.totalBalance?.format || '$0.00'}
            </Box>
          </Typography>
          {originAccount?.isSubAccount && (
            <Typography sx={{ typography: 'subtitle2' }}>
              Saldo en Comisiones{' '}
              <Box component={'span'} color={'warning.main'} fontWeight={'bold'}>
                {originAccount?.commissions?.format || '$0.00'}
              </Box>
            </Typography>
          )}
        </Stack>
      )}

      <Typography sx={{ typography: 'subtitle1' }} color={'text.disabled'}>
        Total balance todas las cuentas{' '}
        <Box component={'span'} color={'info.main'}>
          {' '}
          MXN
        </Box>
      </Typography>
    </Stack>
  )
}
