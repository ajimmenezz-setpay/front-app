import { useState } from 'react'

import PropTypes from 'prop-types'

import { CheckCircle, CopyAll, Refresh } from '@mui/icons-material'
import { Box, IconButton, LinearProgress, Stack, Toolbar, Typography } from '@mui/material'
import { isEmpty } from 'lodash'
import { BsPersonVcardFill } from 'react-icons/bs'

import { useCardCloudSharedStore } from '../../../shared/store'
import { useToggleCardStatusOfCardCloud } from '../../hooks'

import { IconButtonAnimate } from '@/shared/components/animate'
import { IOSSwitch } from '@/shared/components/form'
import { MasterCardLogo } from '@/shared/components/images'
import { CircularLoading } from '@/shared/components/loadings'
import { copyToClipboard } from '@/shared/utils'

export function CardDetailsHeader({ card, isFetchingCardDetails, refetch }) {
  const { mutate: changeStatusCard, isLoading: isChangingStatusCard } = useToggleCardStatusOfCardCloud()
  const { selectedCompany } = useCardCloudSharedStore()
  const [copiedClientId, setCopiedClientId] = useState(false)
  const [copiedClabe, setCopiedClabe] = useState(false)

  const handleChange = event => {
    changeStatusCard(
      { ...card, cardON: !card?.status?.isActive, subAccountId: selectedCompany?.subAccountId },
      {
        onSuccess: () => {},
        onError: () => {}
      }
    )
  }

  return (
    <Toolbar
      sx={theme => ({
        borderRadius: 1,
        position: 'relative',
        zIndex: 1,
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        minHeight: 'auto!important',
        height: { xs: 1, sm: 'auto' },
        padding: '0px!important',
        margin: 0
      })}
    >
      <Stack flex={1}>
        <Stack
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          sx={{ width: 1, p: 2 }}
          gap={2}
          alignItems={'center'}
        >
          <Stack flexDirection="column" spacing={0} alignItems={{ xs: 'center', md: 'start' }}>
            <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
              <Typography variant="subtitle2">Disponible</Typography>
              {isChangingStatusCard ? (
                <CircularLoading
                  size={30}
                  containerProps={{
                    display: 'flex',
                    ml: 1
                  }}
                />
              ) : (
                <IOSSwitch
                  disabled={isChangingStatusCard}
                  color={!card?.status?.isActive ? 'error' : 'success'}
                  checked={card?.status?.isActive || false}
                  onChange={handleChange}
                  sx={{ m: 1, mr: 0 }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              )}

              <IconButtonAnimate
                size="small"
                onClick={refetch}
                sx={{ color: theme => (theme.palette.mode === 'dark' ? 'black' : 'white') }}
                disabled={isFetchingCardDetails}
                aria-haspopup="true"
                title="Actualizar"
              >
                <Refresh width={15} height={15} />
              </IconButtonAnimate>
            </Stack>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <Typography variant="h3">{card?.balance?.format}</Typography>
              <Typography variant="caption">MXN</Typography>
            </Stack>
            {card?.isAssigned && (
              <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                <BsPersonVcardFill fontSize={'48'} opacity={0.8} />
                <Stack>
                  <Typography variant="overline">{card?.userAssigned?.fullName}</Typography>
                  <Typography variant="subtitle2">{card?.userAssigned?.email}</Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
          <Stack justifyContent="flex-end" gap={0} alignItems={{ xs: 'center', md: 'end' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <MasterCardLogo />
              <Typography sx={{ typography: 'h6' }}>{card?.number?.hidden}</Typography>
            </Stack>
            <Stack flexDirection={'row'} alignItems={'center'} gap={0.5}>
              <IconButton
                size="small"
                title={`Copiar ClientID - ${card?.clientId}`}
                variant="outlined"
                onClick={e => {
                  setCopiedClientId(true)
                  copyToClipboard(card?.clientId)
                  setTimeout(() => {
                    setCopiedClientId(false)
                  }, 1000)
                }}
              >
                {copiedClientId ? (
                  <CheckCircle fontSize="small" sx={{ color: 'success.main' }} />
                ) : (
                  <CopyAll
                    fontSize="small"
                    sx={{ color: theme => (theme.palette.mode === 'dark' ? 'black' : 'white') }}
                  />
                )}
              </IconButton>
              <Typography variant="overline">
                CLIENT_ID:{' '}
                <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}>
                  {card?.clientId}
                </Box>
              </Typography>
            </Stack>
            {!isEmpty(card?.clabe) && (
              <Stack flexDirection={'row'} alignItems={'center'} gap={0.5}>
                <IconButton
                  size="small"
                  title={`Copiar CLABE - ${card?.clabe}`}
                  variant="outlined"
                  onClick={e => {
                    setCopiedClabe(true)
                    copyToClipboard(card?.clabe)
                    setTimeout(() => {
                      setCopiedClabe(false)
                    }, 1000)
                  }}
                >
                  {copiedClabe ? (
                    <CheckCircle fontSize="small" sx={{ color: 'success.main' }} />
                  ) : (
                    <CopyAll
                      fontSize="small"
                      sx={{ color: theme => (theme.palette.mode === 'dark' ? 'black' : 'white') }}
                    />
                  )}
                </IconButton>
                <Typography variant="overline">
                  CLABE:{' '}
                  <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontFamily: 'system-ui' }}>
                    {card?.clabe}
                  </Box>
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
        {isFetchingCardDetails && <LinearProgress color="secondary" />}
      </Stack>
    </Toolbar>
  )
}

CardDetailsHeader.propTypes = {
  card: PropTypes.shape({
    balance: PropTypes.shape({
      format: PropTypes.any
    }),
    number: PropTypes.shape({
      hidden: PropTypes.any
    }),
    status: PropTypes.shape({
      isActive: PropTypes.bool
    })
  }),
  isFetchingCardDetails: PropTypes.any,
  refetch: PropTypes.any
}
