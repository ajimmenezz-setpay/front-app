import { useState } from 'react'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'

export default function CardCvv({ card, disableShow }) {
  const [showCVV, setShowCVV] = useState(true)

  const onToggleShowCVV = e => {
    e.stopPropagation()
    setShowCVV(prev => !prev)
  }

  return (
    <Stack position={'relative'}>
      <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>CVV</Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ typography: showCVV ? 'subtitle2' : 'subtitle2' }}>{showCVV ? '***' : card?.cvv}</Typography>
      </Stack>
      {!disableShow && (
        <Box position={'absolute'} sx={{ left: '32px', top: '20px' }}>
          <IconButton size={'small'} color="inherit" onClick={onToggleShowCVV} sx={{ opacity: 0.2 }}>
            {showCVV ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Box>
      )}
    </Stack>
  )
}
