import { lazy, useMemo } from 'react'

import { Autocomplete, Stack, TextField } from '@mui/material'

import { AccountResumeBalance } from '../../shared/components/AccountResumeBalance'
import TransferSpeiDrawer from '../../shared/components/TransferSpeiDrawer'
import { STP_ACCOUNT_TYPES } from '../../shared/constants'
import { useViaboSpeiBreadCrumbs } from '../../shared/hooks'
import { ViaboSpeiCompaniesList } from '../components/ViaboSpeiCompaniesList'
import { useSpeiCompaniesStore } from '../store'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const SpeiNewCompanyDrawer = Lodable(lazy(() => import('../components/new-company/SpeiNewCompanyDrawer')))

export const ViaboSpeiCompanies = () => {
  const { companies } = useViaboSpeiBreadCrumbs()
  const { originAccount, openTransfer, selectedCompanies, stpAccounts } = useSpeiCompaniesStore()
  const { setOriginAccountByPermissions, setOpenTransfer, setSelectedCompanies, setOriginAccount } =
    useSpeiCompaniesStore()

  const isConcentrator = Boolean(originAccount?.type === STP_ACCOUNT_TYPES.CONCENTRATOR)

  const options = useMemo(() => {
    if (stpAccounts?.type === STP_ACCOUNT_TYPES.CONCENTRATOR) {
      return stpAccounts?.accounts || []
    }

    if (stpAccounts?.type === STP_ACCOUNT_TYPES.COST_CENTER) {
      return originAccount?.companies || []
    }
    return stpAccounts?.accounts || []
  }, [stpAccounts, originAccount])

  const handleChangeAccount = (e, newValue) => {
    setOriginAccount(newValue)
  }

  return (
    <Page title="Transferir a Empresas - Spei Cloud">
      <ContainerPage sx={{ pb: 3 }}>
        <HeaderPage
          name={'Transferir a Empresas'}
          links={companies}
          buttons={
            options?.length > 1 ? (
              <Stack flexGrow={1}>
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
              </Stack>
            ) : null
          }
        />
        <Stack mb={3}>
          <AccountResumeBalance
            setAccountsByPermissions={setOriginAccountByPermissions}
            originAccount={originAccount}
          />
        </Stack>
        <ViaboSpeiCompaniesList isConcentrator={isConcentrator} />
        <SpeiNewCompanyDrawer />
        <TransferSpeiDrawer
          open={openTransfer}
          setOpen={setOpenTransfer}
          selectedAccounts={selectedCompanies}
          setSelectedAccounts={setSelectedCompanies}
          originAccount={originAccount}
          isCompanies={true}
        />
      </ContainerPage>
    </Page>
  )
}
