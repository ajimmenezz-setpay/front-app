import { useState } from 'react'

import { Check, CopyAll, Mail, Receipt, Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, Button, Card, Collapse, IconButton, Stack, Typography } from '@mui/material'

import { ModalSharedCharge } from '@/app/business/viabo-card/cards/components/details/ModalSharedCharge'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { copyToClipboard } from '@/shared/utils'

export function CardCharge({ disabledExpand = false }) {
  const card = useCommerceDetailsCard(state => state.card)
  const [expand, setExpand] = useState(disabledExpand)
  const [copiedSPEI, setCopiedSPEI] = useState(false)
  const [openShared, setOpenShared] = useState(false)
  const setOpenFundingOrder = useCommerceDetailsCard(state => state.setOpenFundingOrder)
  const setFundingCard = useCommerceDetailsCard(state => state.setFundingCard)
  const isMainCardSelected = useCommerceDetailsCard(state => state.isMainCardSelected)

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack display="flex" flexDirection={'row'} alignItems="center">
          <Typography variant="h6">{isMainCardSelected ? 'Fondear Comercio' : 'Fondear Tarjeta'}</Typography>
          <Box sx={{ flex: '1 1 auto' }} />
          {!disabledExpand && (
            <IconButton
              onClick={() => {
                setExpand(prev => !prev)
              }}
            >
              {expand ? (
                <VisibilityOff sx={{ color: 'text.disabled' }} />
              ) : (
                <Visibility sx={{ color: 'text.disabled' }} />
              )}
            </IconButton>
          )}
        </Stack>

        <Collapse in={expand} timeout="auto">
          <Stack spacing={2}>
            <Stack
              flexDirection="column"
              justifyContent="space-between"
              alignItems="baseline"
              gap={1}
              sx={{ display: 'flex', flexWrap: 'wrap' }} // Agregar estas propiedades
            >
              <Stack
                flexDirection="row"
                alignItems="center"
                justifyContent={'center'}
                sx={{ flexGrow: 1, flexWrap: 'wrap' }}
                gap={1}
              >
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  SPEI
                </Typography>
                <IconButton
                  variant="outlined"
                  color={copiedSPEI ? 'success' : 'inherit'}
                  onClick={() => {
                    setCopiedSPEI(true)
                    copyToClipboard(card?.SPEI)
                    setTimeout(() => {
                      setCopiedSPEI(false)
                    }, 1000)
                  }}
                >
                  {copiedSPEI ? <Check sx={{ color: 'success' }} /> : <CopyAll sx={{ color: 'text.disabled' }} />}
                </IconButton>
              </Stack>
              <Typography variant="body1">{card?.SPEI}</Typography>
            </Stack>

            <Stack flexDirection={'row'} flexWrap={'wrap'} gap={3} alignItems={'center'}>
              <Button
                fullWidth
                color={'primary'}
                variant={'outlined'}
                startIcon={<Mail />}
                onClick={() => setOpenShared(true)}
              >
                Compartir
              </Button>
              <Button
                fullWidth
                color={'primary'}
                variant={'contained'}
                startIcon={<Receipt />}
                onClick={() => {
                  setOpenFundingOrder(true)
                  setFundingCard(card)
                }}
              >
                Orden Fondeo
              </Button>
            </Stack>
          </Stack>
        </Collapse>
      </Card>
      <ModalSharedCharge
        card={card}
        open={openShared}
        onClose={() => {
          setOpenShared(false)
        }}
      />
    </>
  )
}
