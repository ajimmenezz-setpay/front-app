import { useMemo, useState } from 'react'

import { Box, IconButton, Paper, Stack, Typography, styled, useTheme } from '@mui/material'
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi'

import { useToggleCardStatusOfCardCloud } from '../../cards/hooks'
import { useCardsOfCardCloudStore } from '../../cards/store'
import { useCardCloudSharedStore } from '../../shared/store'

import { IOSSwitch } from '@/shared/components/form'
import { MasterCardLogo } from '@/shared/components/images'
import { CircularLoading } from '@/shared/components/loadings'

const HEIGHT = 276

const CardItemStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  height: HEIGHT - 16,
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: theme.transitions.create('all')
}))

export const CardCloudUserCardItem = () => {
  const theme = useTheme()
  const [showCurrency, setShowCurrency] = useState(false)
  const { setSelectedCard } = useCardsOfCardCloudStore()
  const { selectedCard: card } = useCardsOfCardCloudStore()
  const selectedCompany = useCardCloudSharedStore(state => state.selectedCompany)

  const { mutate: changeStatusCard, isLoading: isChangingStatusCard } = useToggleCardStatusOfCardCloud()

  const bgGradient = useMemo(() => card?.styles?.bgGradient(theme), [card?.styles, theme])

  const styles = useMemo(() => card?.styles, [card?.styles])

  const handleChange = event => {
    changeStatusCard(
      { ...card, cardON: !card?.status?.isActive, subAccountId: selectedCompany?.subAccountId },
      {
        onSuccess: data => {
          if (data?.response) {
            const { userAssigned, ...cardUpdated } = data?.response
            setSelectedCard({ ...card, ...cardUpdated })
          }
        },
        onError: () => {}
      }
    )
  }

  const onToggleShowCurrency = () => {
    setShowCurrency(prev => !prev)
  }

  return (
    <CardItemStyle
      sx={theme => ({
        color: styles?.color || 'text.primary',
        ...bgGradient
      })}
    >
      <Box sx={{ position: 'absolute', top: 25, right: 16, zIndex: 9 }}>
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
      </Box>

      <div>
        <Typography sx={{ mb: 2, typography: 'subtitle2', opacity: 0.8 }}> Balance</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography sx={{ typography: 'h3' }}>{showCurrency ? '********' : card?.balance?.format}</Typography>
          <IconButton color="inherit" onClick={onToggleShowCurrency} sx={{ opacity: 0.6 }}>
            {showCurrency ? <PiEyeBold /> : <PiEyeClosedBold />}
          </IconButton>
        </Stack>
      </div>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
        <Paper sx={{ p: 1, backgroundColor: card?.palette?.lighter }}>
          <MasterCardLogo sx={{ width: 30, height: 30 }} />
        </Paper>
        <Typography sx={{ typography: 'subtitle1', textAlign: 'right' }}>{card?.number?.hidden}</Typography>
      </Stack>

      <Stack direction="row" spacing={5}>
        <div>
          <Typography sx={{ typography: 'caption', opacity: 0.7 }}>Tarjetahabiente</Typography>
          <Typography sx={{ typography: 'subtitle1' }}>{card?.userAssigned?.fullName}</Typography>
        </div>
      </Stack>
    </CardItemStyle>
  )
}
