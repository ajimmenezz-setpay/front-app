import { useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { Check, Update } from '@mui/icons-material'
import { Box, Card, CardHeader, Divider, IconButton, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'

import { FundingGlobalCard } from './funding/FundingGlobalCard'

import { useToggleStatusCard } from '../../viabo-card/cards/hooks'
import { useMasterGlobalStore } from '../store'

import { getCardTypeByName } from '@/app/shared/services'
import { IOSSwitch } from '@/shared/components/form'
import { SpeiLogo } from '@/shared/components/images'
import { CircularLoading } from '@/shared/components/loadings'
import { copyToClipboard } from '@/shared/utils'

const MainCardDetails = ({ card, cardSelected, isRefetchingCards, commerceCards, disableFilter = false }) => {
  const [copiedSPEI, setCopiedSPEI] = useState(false)
  const [copiedCardNumber, setCopiedCardNumber] = useState(false)
  const cardLogo = getCardTypeByName(card?.paymentProcessor)
  const CardLogoComponent = cardLogo?.component
  const selected = cardSelected?.id === card?.id
  const { setGlobalCard, setIsMaster, setFilterPaymentProcessor } = useMasterGlobalStore(state => state)

  const { mutate: changeStatusCard, isLoading: isChangingStatusCard } = useToggleStatusCard()
  const [cardIdToggleStatus, setCardIdToggleStatus] = useState(null)

  const commerceCardsByPaymentProcessor = useMemo(
    () => (commerceCards && commerceCards[card?.paymentProcessorId]) || [],
    [commerceCards]
  )

  const total = commerceCardsByPaymentProcessor?.length || 0

  const handleSelectPaymentProcessor = card => e => {
    if (disableFilter) {
      return
    }
    setFilterPaymentProcessor(card?.paymentProcessor)
    setIsMaster(false)
    setGlobalCard(card)
  }

  const isChangingStatus = (isChangingStatusCard && cardIdToggleStatus === card?.id) || isRefetchingCards

  return (
    <Stack key={card?.cardId}>
      <Card
        sx={{
          minWidth: { xs: 300, md: 'auto' },
          border: selected ? 3 : 1
          // borderColor: theme =>
          //   selected
          //     ? theme.palette.mode === 'dark'
          //       ? theme.palette.secondary.main
          //       : theme.palette.primary.main
          //     : 'inherit'
        }}
      >
        <CardHeader
          title={
            <Stack flexDirection={'row'} gap={1} alignItems={'center'} justifyContent={'space-between'}>
              <Typography variant="caption">{total === 0 ? '' : total + ' Tarjetas'}</Typography>

              <Stack flexDirection="row" alignItems="center" sx={{ flexWrap: 'wrap' }} gap={0}>
                {cardLogo && (
                  <IconButton
                    variant="outlined"
                    title={`Copiar Tarjeta - ${card?.cardNumber}`}
                    color={copiedCardNumber ? 'success' : 'inherit'}
                    onClick={e => {
                      setCopiedCardNumber(true)
                      copyToClipboard(card?.cardNumber)
                      setTimeout(() => {
                        setCopiedCardNumber(false)
                      }, 1000)
                    }}
                    size="small"
                    sx={{ width: 40, height: 40 }}
                  >
                    {copiedCardNumber ? <Check sx={{ color: 'success' }} /> : <CardLogoComponent />}
                  </IconButton>
                )}
                <IconButton
                  variant="outlined"
                  title={`Copiar SPEI - ${card?.SPEI}`}
                  color={copiedSPEI ? 'success' : 'inherit'}
                  size="small"
                  onClick={e => {
                    setCopiedSPEI(true)
                    copyToClipboard(card?.SPEI)
                    setTimeout(() => {
                      setCopiedSPEI(false)
                    }, 1000)
                  }}
                  sx={{ width: 40, height: 40 }}
                >
                  {copiedSPEI ? <Check sx={{ color: 'success' }} /> : <SpeiLogo />}
                </IconButton>
                <Stack ml={1}>
                  {isChangingStatus ? (
                    <CircularLoading
                      size={15}
                      containerProps={{
                        display: 'flex',
                        ml: 1
                      }}
                    />
                  ) : (
                    <IOSSwitch
                      disabled={isChangingStatus}
                      size="sm"
                      color={!card?.cardON ? 'error' : 'success'}
                      checked={card?.cardON || false}
                      inputProps={{ 'aria-label': 'controlled' }}
                      onChange={() => {
                        setCardIdToggleStatus(card?.id)
                        changeStatusCard(
                          { ...card, cardON: !card?.cardON },
                          {
                            onSuccess: () => {
                              setCardIdToggleStatus(null)
                            },
                            onError: () => {
                              setCardIdToggleStatus(null)
                            }
                          }
                        )
                      }}
                    />
                  )}
                </Stack>
              </Stack>
            </Stack>
          }
          sx={{ px: 2, py: 2 }}
        />
        <Box
          component={!disableFilter ? motion.div : 'div'}
          onClick={handleSelectPaymentProcessor(card)}
          {...(disableFilter
            ? {}
            : {
                whileTap: { scale: 0.8 },
                style: { cursor: 'pointer' }
              })}
        >
          <Stack alignItems={'center'} pb={2} px={2}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <Typography variant="h6">{card?.balanceFormatted}</Typography>
              <Typography variant="caption">MXN</Typography>
            </Stack>

            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <Update sx={{ width: 20, height: 20, color: 'text.secondary' }} />

              <Stack alignItems={'center'}>
                <Typography variant={'subtitle2'}>En transito</Typography>

                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <Typography variant="body2">{card?.inTransitFormatted}</Typography>
                  <Typography variant="caption">MXN</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <FundingGlobalCard
          isRefetchingCards={isRefetchingCards}
          commerceCards={commerceCardsByPaymentProcessor}
          card={card}
        />
      </Card>
    </Stack>
  )
}

MainCardDetails.propTypes = {
  card: PropTypes.shape({
    SPEI: PropTypes.any,
    balanceFormatted: PropTypes.any,
    cardId: PropTypes.any,
    id: PropTypes.any,
    inTransitFormatted: PropTypes.any,
    paymentProcessor: PropTypes.any,
    paymentProcessorId: PropTypes.any,
    cardNumber: PropTypes.any
  }),
  cardSelected: PropTypes.shape({
    id: PropTypes.any
  }),
  commerceCards: PropTypes.any,
  disableFilter: PropTypes.bool,
  isRefetchingCards: PropTypes.any
}

export default MainCardDetails
