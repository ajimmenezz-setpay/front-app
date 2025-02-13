import { useEffect, useMemo } from 'react'

import { Autocomplete, Stack, TextField } from '@mui/material'

import { STP_ACCOUNT_TYPES } from '../../shared/constants'
import { useFindViaboSpeiAccountsInfo, useViaboSpeiBreadCrumbs } from '../../shared/hooks'
import { BillingReportTable } from '../components/BillingReportTable'
import { useSpeiBillingReportStore } from '../store'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { useUser } from '@/shared/hooks'

export const BillingReport = () => {
  const { billingReport } = useViaboSpeiBreadCrumbs()

  const { originAccount, stpAccounts, selectedCompany } = useSpeiBillingReportStore()
  const { setOriginAccountByPermissions, setOriginAccount, setSelectedCompany } = useSpeiBillingReportStore()

  const { permissions } = useUser()
  const queryAccounts = useFindViaboSpeiAccountsInfo()

  const options = useMemo(() => {
    if (stpAccounts?.type === STP_ACCOUNT_TYPES.CONCENTRATOR) {
      return stpAccounts?.accounts || []
    }

    if (stpAccounts?.type === STP_ACCOUNT_TYPES.COST_CENTER) {
      return originAccount?.companies || []
    }
    return stpAccounts?.accounts || []
  }, [stpAccounts, originAccount])

  const isConcentrator = Boolean(originAccount?.type === STP_ACCOUNT_TYPES.CONCENTRATOR)

  useEffect(() => {
    if (queryAccounts?.data) {
      setOriginAccountByPermissions(queryAccounts?.data, permissions)
    }
  }, [queryAccounts?.data, permissions])

  const handleChangeAccount = (e, newValue) => {
    setOriginAccount(newValue)
    if (!isConcentrator) {
      setSelectedCompany(newValue)
    }
    if (isConcentrator) {
      setSelectedCompany(newValue?.companies?.[0])
    }
  }

  const handleChangeCompanyByConcentrator = (e, newValue) => {
    setSelectedCompany(newValue)
  }

  return (
    <Page title={'Estado de Cuenta - SPEI Cloud'}>
      <ContainerPage sx={{ pb: 3 }}>
        <HeaderPage
          name={'Estado de Cuenta'}
          links={billingReport}
          buttons={
            <Stack flexGrow={1} gap={2}>
              {options?.length > 1 && (
                <Autocomplete
                  disableClearable
                  options={options || []}
                  fullWidth
                  size="small"
                  value={originAccount}
                  onChange={handleChangeAccount}
                  getOptionLabel={option => option?.label || ''}
                  getOptionDisabled={option => option?.isDisabled}
                  isOptionEqualToValue={(option, current) => option?.value === current?.value}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={isConcentrator ? 'Concentradoras' : 'Empresas'}
                      placeholder="Seleccionar"
                      InputProps={{
                        ...params.InputProps
                      }}
                    />
                  )}
                />
              )}
              {isConcentrator && (
                <Autocomplete
                  disableClearable
                  options={originAccount?.companies || []}
                  fullWidth
                  size="small"
                  value={selectedCompany}
                  onChange={handleChangeCompanyByConcentrator}
                  getOptionLabel={option => option?.label || ''}
                  getOptionDisabled={option => option?.isDisabled}
                  isOptionEqualToValue={(option, current) => option?.value === current?.value}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={'Empresas'}
                      placeholder="Seleccionar"
                      InputProps={{
                        ...params.InputProps
                      }}
                    />
                  )}
                />
              )}
            </Stack>
          }
        />
        <BillingReportTable queryAccounts={queryAccounts} isConcentrator={isConcentrator} />
      </ContainerPage>
    </Page>
  )
}
