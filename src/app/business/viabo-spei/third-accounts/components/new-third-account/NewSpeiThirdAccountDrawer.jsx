import { lazy, useEffect } from 'react'

import { Stack, Typography } from '@mui/material'

import { useFindSpeiBanks } from '../../hooks'
import { useSpeiThirdAccounts } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage, TwoAuthDisabled } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'
import { useUser } from '@/shared/hooks'

const NewSpeiThirdAccountForm = Lodable(lazy(() => import('./NewSpeiThirdAccountForm')))

const NewSpeiThirdAccountDrawer = () => {
  const { openNewAccount, setOpenNewSpeiThirdAccount, account, setSpeiThirdAccount } = useSpeiThirdAccounts()

  const { data: catalogBanks, isFetching: isLoading, isError, error, refetch } = useFindSpeiBanks({ enabled: false })

  const { twoAuth } = useUser()

  useEffect(() => {
    if (openNewAccount && twoAuth) {
      refetch()
    }
  }, [openNewAccount])

  const handleClose = () => {
    setOpenNewSpeiThirdAccount(false)
    setSpeiThirdAccount(null)
  }

  return (
    <RightPanel
      open={openNewAccount}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>{account ? 'Editar Cuenta de Terceros' : 'Nueva Cuenta de Terceros'}</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack spacing={3} p={3}>
          {isLoading && <RequestLoadingComponent />}
          {isError && !isLoading && (
            <ErrorRequestPage errorMessage={error} titleMessage={'Lista de Bancos'} handleButton={() => refetch()} />
          )}
          {!isError && !isLoading && openNewAccount && twoAuth && (
            <NewSpeiThirdAccountForm account={account} catalogBanks={catalogBanks} onSuccess={handleClose} />
          )}
          {!isError && !isLoading && openNewAccount && !twoAuth && (
            <TwoAuthDisabled
              titleMessage={'Google Authenticator'}
              errorMessage={
                'Para realizar esta operación debe activar y configurar el Doble Factor de Autentificación (2FA) desde su perfil.'
              }
            />
          )}
        </Stack>
      </Scrollbar>
    </RightPanel>
  )
}

export default NewSpeiThirdAccountDrawer
