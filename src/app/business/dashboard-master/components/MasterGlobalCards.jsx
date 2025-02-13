import { useMemo } from 'react'

import { Update } from '@mui/icons-material'
import { Card, CardHeader, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'

import MainCardDetails from './MainCardDetails'

import { useFindCommerceCardsByPaymentProcessors, useFindGlobalCards } from '../hooks'

import { useMasterGlobalStore } from '@/app/business/dashboard-master/store'
import { RequestLoadingComponent } from '@/shared/components/loadings'

export function MasterGlobalCards() {
  const { data, isLoading, isFetching: isFetchingGlobalCards } = useFindGlobalCards()

  const cardSelected = useMasterGlobalStore(state => state.card)

  const resetGlobalCard = useMasterGlobalStore(state => state.resetGlobalCard)
  const setIsMaster = useMasterGlobalStore(state => state.setIsMaster)
  const setFilterPaymentProcessor = useMasterGlobalStore(state => state.setFilterPaymentProcessor)
  const isMaster = useMasterGlobalStore(state => state.isMaster)

  const paymentProcessorsIds = useMemo(
    () =>
      data?.globals?.reduce((accumulator, processor) => {
        accumulator.push(processor.paymentProcessorId)
        return accumulator
      }, []) || null,
    [data?.globals]
  )

  const { data: commerceCards, isRefetching: isRefetchingCards } = useFindCommerceCardsByPaymentProcessors(
    paymentProcessorsIds,
    {
      enabled: !!paymentProcessorsIds
    }
  )

  const master = data?.master
  const globals = data?.globals

  const size = isLoading || globals?.length > 0

  return (
    <Stack minWidth={size ? 300 : 'auto'} mr={{ md: size ? 3 : 0 }} mb={{ xs: size ? 3 : 0, md: 0 }}>
      <AnimatePresence>
        <Stack spacing={2} flex={1}>
          {isLoading && <RequestLoadingComponent sx={{ zIndex: 1 }} />}

          {!isLoading && (
            <>
              {data?.globals?.length > 1 && (
                <motion.div
                  onClick={() => {
                    setIsMaster(true)
                    resetGlobalCard()
                    setFilterPaymentProcessor(null)
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Card
                    sx={{
                      p: 0,
                      cursor: 'pointer',
                      border: isMaster ? 3 : 0,
                      borderColor: theme =>
                        isMaster
                          ? theme.palette.mode === 'dark'
                            ? theme.palette.secondary.main
                            : theme.palette.primary.main
                          : 'inherit'
                    }}
                  >
                    <CardHeader
                      title={
                        <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                          <Typography variant="subtitle2">Global [Master]</Typography>
                        </Stack>
                      }
                      sx={{ px: 2, py: 2 }}
                    />

                    <Stack alignItems={'center'} pb={2} px={2}>
                      <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <Typography variant="h3">{master?.balanceFormatted}</Typography>
                        <Typography variant="caption">MXN</Typography>
                      </Stack>

                      <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <Update sx={{ width: 30, height: 30, color: 'text.secondary' }} />

                        <Stack alignItems={'center'}>
                          <Typography variant={'subtitle2'}>En transito</Typography>

                          <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <Typography variant="body1">{master?.inTransitFormatted}</Typography>
                            <Typography variant="caption">MXN</Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Card>
                </motion.div>
              )}

              {globals?.map(card => (
                <MainCardDetails
                  key={card?.id}
                  card={card}
                  cardSelected={cardSelected}
                  isRefetchingCards={isRefetchingCards || isFetchingGlobalCards}
                  commerceCards={commerceCards}
                  disableFilter={data?.globals?.length <= 1}
                />
              ))}
            </>
          )}
        </Stack>
      </AnimatePresence>
    </Stack>
  )
}
