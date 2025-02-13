import { useEffect } from 'react'

import { Alert, Box, Stack } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'

import { CardActions, CardMovements } from '@/app/business/viabo-card/cards/components/details'
import { CardDetailsHeader } from '@/app/business/viabo-card/cards/components/details/header'
import { useFindCardDetails } from '@/app/business/viabo-card/cards/hooks'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { SelectDataIllustration } from '@/shared/components/illustrations'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { ErrorRequestPage } from '@/shared/components/notifications'

export function CardDetails() {
  const card = useCommerceDetailsCard(state => state.card)
  const addInfoCard = useCommerceDetailsCard(state => state.addInfoCard)
  const { data, isLoading, isError, error, refetch } = useFindCardDetails(card?.id, {
    enabled: !!card?.id
  })

  useEffect(() => {
    if (data) {
      addInfoCard(data)
    }
  }, [data])

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
        {isLoading && card && <RequestLoadingComponent />}
        {isError && !data && !isLoading && (
          <ErrorRequestPage sx={{ justifyContent: 'flex-start' }} errorMessage={error} handleButton={refetch} />
        )}
        {card && !isLoading && !isError && data && (
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
                <CardDetailsHeader card={card} />
                <CardActions />
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
                  <CardMovements />
                </Stack>
              </motion.div>
            </Box>
          </>
        )}
        {!card && (
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
