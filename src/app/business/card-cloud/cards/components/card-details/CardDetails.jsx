import { useEffect } from 'react'

import { Alert, Box, Stack } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'

import CardActionsOfCardCloud from './CardActionsOfCardCloud'
import { CardDetailsHeader } from './CardDetailsHeader'

import { useFindCardInfoOfCardCloud } from '../../hooks'
import { useCardsOfCardCloudStore } from '../../store'
import { CardMovementsOfCardCloud } from '../card-movements/CardMovementsOfCardCloud'

import { SelectDataIllustration } from '@/shared/components/illustrations'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { ErrorRequestPage } from '@/shared/components/notifications'

export const CardDetails = ({ loading, isError, error }) => {
  const card = useCardsOfCardCloudStore(state => state.selectedCard)
  const updateSelectedCardInfo = useCardsOfCardCloudStore(state => state.updateSelectedCardInfo)
  const {
    data,
    isLoading,
    isError: isErrorCard,
    error: errorCard,
    refetch,
    isFetching
  } = useFindCardInfoOfCardCloud(card?.id, {
    enabled: !!card?.id
  })

  useEffect(() => {
    if (data && card?.id === data?.id) {
      updateSelectedCardInfo(data)
    }
  }, [data])

  useEffect(() => {
    if (card?.id) {
      refetch()
    }
  }, [card?.id])

  const loadingState = loading || isLoading
  const errorState = errorCard || error
  const isErrorState = isErrorCard || isError

  return (
    <Stack
      sx={theme => ({
        pl: { xs: 0, sm: 2, lg: 2 },
        overflow: 'hidden',
        flexDirection: 'column',
        flexGrow: 1
      })}
    >
      <AnimatePresence>
        {loadingState && <RequestLoadingComponent sx={{ justifyContent: 'center', alignItems: 'center' }} />}
        {isErrorState && !loadingState && (
          <ErrorRequestPage sx={{ justifyContent: 'flex-start' }} errorMessage={errorState} handleButton={refetch} />
        )}
        {card && !loadingState && !isErrorState && (
          <>
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Stack
                sx={theme => ({
                  overflow: 'hidden',
                  flexDirection: 'column',
                  flexGrow: 1
                })}
              >
                <CardDetailsHeader card={card} isFetchingCardDetails={isFetching} refetch={refetch} />
                <CardActionsOfCardCloud />
              </Stack>
            </motion.div>
            <Box sx={{ overflowY: 'auto' }}>
              <motion.div
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <Stack pt={2} pb={4}>
                  <CardMovementsOfCardCloud />
                </Stack>
              </motion.div>
            </Box>
          </>
        )}
        {!card && !loadingState && !isErrorState && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Stack spacing={3} sx={{ height: '100%', width: '100%' }}>
              <Alert variant="filled" severity="info">
                Debe seleccionar una tarjeta para ver sus detalles!
              </Alert>
              <Stack alignItems={'center'}>
                <SelectDataIllustration sx={{ width: '30%' }} />
              </Stack>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  )
}
