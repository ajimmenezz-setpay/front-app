import { CurrencyExchangeOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Stack, Typography } from '@mui/material'

import CardActionsOfCardCloud from '../../cards/components/card-details/CardActionsOfCardCloud'
import { useCardsOfCardCloudStore } from '../../cards/store'

export const CardCloudUserCardActions = () => {
  const { selectedCard: card } = useCardsOfCardCloudStore()
  const { setOpenTransferToCards } = useCardsOfCardCloudStore()

  return (
    <Stack gap={2} px={{ xs: 0, md: 4 }}>
      <Typography variant="body1" fontWeight={'bold'}>
        Información Tarjetahabiente
      </Typography>
      <Stack gap={2}>
        <Stack gap={2} flexDirection={'row'} flexWrap={'wrap'}>
          <Stack flex={1}>
            <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.7 }}>Tarjeta</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>{card?.type?.name || '...'}</Typography>
          </Stack>
          <Stack flex={1}>
            <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.7 }}>Número de Tarjeta</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>{card?.number?.hidden || '...'}</Typography>
          </Stack>
        </Stack>
        <Stack gap={2} flexDirection={'row'} flexWrap={'wrap'}>
          <Stack flex={1}>
            <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.7 }}>Marca</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>Mastercard</Typography>
          </Stack>

          <Stack flex={1}>
            <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.7 }}>Nombre</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>{card?.userAssigned?.fullName || '...'}</Typography>
          </Stack>
        </Stack>

        <Stack flex={1}>
          <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.7 }}>Correo</Typography>
          <Typography sx={{ typography: 'subtitle1' }}>{card?.userAssigned?.email || '...'}</Typography>
        </Stack>
      </Stack>
      {card && (
        <CardActionsOfCardCloud
          transferPermission={false}
          changeNipPermission={true}
          actions={
            <Stack>
              <LoadingButton
                disabled={card?.balance?.number <= 0}
                startIcon={<CurrencyExchangeOutlined />}
                variant={'outlined'}
                onClick={() => {
                  setOpenTransferToCards(true)
                }}
              >
                Transferir
              </LoadingButton>
            </Stack>
          }
        />
      )}
    </Stack>
  )
}
