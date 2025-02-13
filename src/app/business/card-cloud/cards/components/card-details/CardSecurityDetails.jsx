import { memo, useState } from 'react'

import { Check, CopyAll } from '@mui/icons-material'
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  circularProgressClasses
} from '@mui/material'
import { intervalToDuration } from 'date-fns'
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi'

import { copyToClipboard, isEmpty } from '@/shared/utils'

const CardSecurityDetails = ({ card, dataCVV, securityInfo, remainingTime, progress }) => {
  const [state, setState] = useState({
    visibleFields: {
      number: false,
      clabe: false,
      clientId: true,
      nip: false,
      expiration: false,
      cvv: false
    },
    copiedField: null
  })

  const toggleVisibility = field => {
    setState(prev => ({
      ...prev,
      visibleFields: { ...prev.visibleFields, [field]: !prev.visibleFields[field] }
    }))
  }

  const handleCopy = (text, field) => {
    copyToClipboard(text)
    setState(prev => ({ ...prev, copiedField: field }))
    setTimeout(() => setState(prev => ({ ...prev, copiedField: null })), 1000)
  }

  const renderSecureField = (value, field, copyValue, title) => (
    <Stack direction="row" justifyContent="space-between" width="100%">
      <Stack>
        <Typography variant="overline">{title}</Typography>
        <Typography variant="subtitle1">{state.visibleFields[field] ? value : '****'}</Typography>
      </Stack>

      <Stack direction="row" gap={0.5}>
        <Box>
          <Tooltip title={state.visibleFields[field] ? 'Ocultar' : 'Mostrar'}>
            <IconButton onClick={() => toggleVisibility(field)} size="small">
              {state.visibleFields[field] ? <PiEyeClosedBold fontSize="18px" /> : <PiEyeBold fontSize="18px" />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title={state.copiedField === field ? 'Copiado' : 'Copiar'}>
            <IconButton
              onClick={() => handleCopy(copyValue, field)}
              color={state.copiedField === field ? 'success' : 'default'}
              size="small"
            >
              {state.copiedField === field ? <Check fontSize="small" /> : <CopyAll fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  )

  if (card?.type?.isPhysical) {
    return (
      <Stack p={4} gap={3} divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}>
        <Stack>{renderSecureField(card?.number?.hidden, 'number', card?.number?.hidden, 'Número')}</Stack>

        {!isEmpty(card?.clabe) && <Stack>{renderSecureField(card?.clabe, 'clabe', card?.clabe, 'Clabe')}</Stack>}

        <Stack>{renderSecureField(card?.clientId, 'clientId', card?.clientId, 'Client_Id')}</Stack>

        <Stack>{renderSecureField(securityInfo?.nip, 'nip', securityInfo?.nip, 'Nip')}</Stack>
      </Stack>
    )
  }

  return (
    <Stack p={4} gap={3} divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}>
      <Stack>{renderSecureField(securityInfo?.number?.format, 'number', securityInfo?.number?.full, 'Número')}</Stack>

      {!isEmpty(card?.clabe) && <Stack>{renderSecureField(card?.clabe, 'clabe', card?.clabe, 'Clabe')}</Stack>}

      <Stack>{renderSecureField(card?.clientId, 'clientId', card?.clientId, 'Client_Id')}</Stack>

      <Stack
        direction="row"
        gap={2}
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack flex={1}>
          {renderSecureField(securityInfo?.expiration?.format, 'expiration', securityInfo?.expiration?.format, 'Vence')}
        </Stack>
        <Stack flex={1}>{renderSecureField(dataCVV?.cvv, 'cvv', dataCVV?.cvv, 'CVV')}</Stack>
      </Stack>

      <CVVTimer expiration={dataCVV?.expiration} remainingTime={remainingTime} progress={progress} />
    </Stack>
  )
}

export default memo(CardSecurityDetails)

function CVVTimer({ expiration, remainingTime, progress }) {
  if (expiration?.original) {
    return (
      <Stack flexDirection={'row'} gap={2} alignItems={'center'} flex={1}>
        <CircularStatic remainingTime={remainingTime} progress={progress} />
        <Stack>
          <Typography variant="body2">El CVV es dinámico</Typography>
          <Typography fontWeight={'bold'} variant="body2">
            Expira el {expiration?.date}
          </Typography>
        </Stack>
      </Stack>
    )
  }

  return null
}

function CircularStatic({ remainingTime = 0, progress = 100 }) {
  const formatTime = timeInSeconds => {
    const duration = intervalToDuration({ start: 0, end: timeInSeconds * 1000 })
    const minutes = String(duration?.minutes ?? 0).padStart(2, '0')
    const seconds = String(duration?.seconds ?? 0).padStart(2, '0')
    return `${minutes}:${seconds}`
  }
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box position={'relative'}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: theme => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 900]
          }}
          size={70}
          value={100}
        />
        <CircularProgress
          color={'secondary'}
          variant="determinate"
          sx={{
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round'
            }
          }}
          size={70}
          value={progress}
        />
      </Box>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 5,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="caption" component="div" color="text.primary.contrastText">
          {formatTime(remainingTime)}
        </Typography>
      </Box>
    </Box>
  )
}
