import { lazy, useMemo } from 'react'

import { Autocomplete, Stack, TextField } from '@mui/material'

import { AccountResumeBalance } from '../../shared/components/AccountResumeBalance'
import { STP_ACCOUNT_TYPES } from '../../shared/constants'
import { useViaboSpeiBreadCrumbs } from '../../shared/hooks'
import { SpeiThirdAccountsList } from '../components/SpeiThirdAccountsList'
import { useSpeiThirdAccounts } from '../store'

import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { Lodable } from '@/shared/components/lodables'

const NewSpeiThirdAccountDrawer = Lodable(
  lazy(() => import('../components/new-third-account/NewSpeiThirdAccountDrawer'))
)
const AlertConfirmationDeleteAccount = Lodable(lazy(() => import('../components/AlertConfirmationDeleteAccount')))

const TransferSpeiDrawer = Lodable(lazy(() => import('../../shared/components/TransferSpeiDrawer')))

export const SpeiThirdAccounts = () => {
  const { speiTransfer } = useViaboSpeiBreadCrumbs()

  const { originAccount, openTransfer, selectedThirdAccounts, stpAccounts } = useSpeiThirdAccounts()
  const { setOriginAccountByPermissions, setOpenTransfer, setSelectedThirdAccounts, setOriginAccount } =
    useSpeiThirdAccounts()
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
    <Page title="Transferir SPEI - Spei Cloud">
      <ContainerPage sx={{ pb: 3 }}>
        <HeaderPage
          name={'Transferir SPEI'}
          links={speiTransfer}
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
        <SpeiThirdAccountsList />
        <NewSpeiThirdAccountDrawer />
        <AlertConfirmationDeleteAccount />
        <TransferSpeiDrawer
          open={openTransfer}
          setOpen={setOpenTransfer}
          selectedAccounts={selectedThirdAccounts}
          setSelectedAccounts={setSelectedThirdAccounts}
          originAccount={originAccount}
        />
      </ContainerPage>
    </Page>
  )
}
