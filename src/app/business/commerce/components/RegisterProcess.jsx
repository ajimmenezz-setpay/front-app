import { lazy, Suspense, useEffect, useMemo } from 'react'

import { Box, Button, CircularProgress, Stack } from '@mui/material'

import { useFindCommerceProcess } from '@/app/business/commerce/hooks'
import { PROCESS_LIST } from '@/app/business/commerce/services'
import { useRegisterProcessStore } from '@/app/business/commerce/store'

export const RegisterProcess = () => {
  const store = useRegisterProcessStore()
  const component = useRegisterProcessStore(state => state.getComponent)
  const getBackProcess = useRegisterProcessStore(state => state.getBackProcess)
  const { setActualProcess, setResume, setToken } = useRegisterProcessStore()
  const actualProcess = useRegisterProcessStore(state => state.actualProcess)
  const token = useRegisterProcessStore(state => state.token)

  const { data: commerceProcess, isSuccess: isSuccessCommerceProcess } = useFindCommerceProcess({
    enabled: !!token
  })

  useEffect(() => {
    if (commerceProcess && isSuccessCommerceProcess) {
      setResume(commerceProcess)
    } else {
      setResume(null)
    }
  }, [commerceProcess, isSuccessCommerceProcess])

  useEffect(() => {
    if (actualProcess === PROCESS_LIST.REGISTER) {
      setToken(null)
      setResume(null)
    }
  }, [actualProcess, setToken])

  const handleBack = () => {
    const backProcess = getBackProcess()
    setActualProcess(backProcess)
  }

  const LazyComponent = useMemo(() => lazy(component()), [actualProcess])
  return (
    <Box
      sx={{
        height: { xs: '100%', sm: '100%', md: '100%', lg: '100vh', xl: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        zIndex: 1
      }}
    >
      <Suspense fallback={<LoadingSuspense />}>
        {actualProcess !== PROCESS_LIST.REGISTER && (
          <Stack m={5} mb={0} direction="row">
            <Button onClick={handleBack}>{'< Regresar'}</Button>
          </Stack>
        )}

        <Box m={5} height={1}>
          <LazyComponent store={store} />
        </Box>
      </Suspense>
    </Box>
  )
}

const LoadingSuspense = () => (
  <Box
    sx={{
      position: 'relative',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(1px)',
      zIndex: theme => theme.zIndex.modal - 1
    }}
  >
    <CircularProgress />
  </Box>
)
