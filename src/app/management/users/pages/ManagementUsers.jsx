import { lazy, useEffect, useMemo } from 'react'

import { Autocomplete, Stack, TextField } from '@mui/material'

import { useManagementBreadCrumbs } from '../../shared/hooks'
import { UsersByCardCloudList } from '../components/users-by-card-cloud/UsersByCardCloudList'
import { UserBySpeiCloudList } from '../components/users-by-spei-cloud/UserBySpeiCloudList'
import { useManagementUsersStore } from '../store'

import { STP_ACCOUNT_TYPES } from '@/app/business/viabo-spei/shared/constants'
import { useFindViaboSpeiAccountsInfo } from '@/app/business/viabo-spei/shared/hooks'
import { Page } from '@/shared/components/containers'
import { ContainerPage } from '@/shared/components/containers/ContainerPage'
import { HeaderPage } from '@/shared/components/layout'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { useUser } from '@/shared/hooks'

const ManagementUserDrawer = Lodable(lazy(() => import('../components/edit-user/ManagementUserDrawer')))

export const ManagementUsers = () => {
  const { users } = useManagementBreadCrumbs()
  const { permissions } = useUser()

  const { originAccount, stpAccounts } = useManagementUsersStore()
  const { setOriginAccountByPermissions, setOriginAccount } = useManagementUsersStore()

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
  }

  const isLoading = queryAccounts?.isLoading
  const error = queryAccounts?.error
  const isError = queryAccounts?.isError

  return (
    <Page title="Administración de Usuarios">
      <ContainerPage sx={{ pb: 3 }}>
        <HeaderPage
          name={'Administración de Usuarios'}
          links={users}
          buttons={
            options?.length > 1 && !isConcentrator ? (
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
                      label={'Empresas'}
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
        {isLoading && <RequestLoadingComponent sx={{ p: 3, height: '100dvH' }} />}
        {isError && !isLoading && (
          <ErrorRequestPage
            sx={{ p: 3 }}
            errorMessage={error}
            titleMessage={'Información Usuarios'}
            handleButton={queryAccounts?.refetch}
          />
        )}
        {isConcentrator && !isLoading && !isError && <UserBySpeiCloudList />}
        {!isConcentrator && !isLoading && !isError && <UsersByCardCloudList originAccount={originAccount} />}
      </ContainerPage>
      <ManagementUserDrawer />
    </Page>
  )
}
