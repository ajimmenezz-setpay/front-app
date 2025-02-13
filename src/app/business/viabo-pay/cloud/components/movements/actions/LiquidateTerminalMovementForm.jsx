import PropTypes from 'prop-types'

import { LoadingButton } from '@mui/lab'
import { Box, Divider, Stack, Typography } from '@mui/material'

import { useLiquidateTerminalMovement } from '../../../hooks'

import { getCardTypeByName } from '@/app/shared/services'

const LiquidateTerminalMovementForm = ({ movement, onSuccess }) => {
  const cardLogo = getCardTypeByName(movement?.cardType)
  const CardLogoComponent = cardLogo?.component

  const { mutate, isLoading } = useLiquidateTerminalMovement()

  const handleLiquidateMovement = () => {
    mutate(movement?.dataToLiquidate, {
      onSuccess: () => {
        onSuccess()
      }
    })
  }

  return (
    <Stack px={5} py={3}>
      <Stack alignItems={'center'} justifyContent={'center'} spacing={0.5}>
        <Stack alignItems={'center'} justifyContent={'center'}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="h2"> {movement?.amount}</Typography>
            <Typography variant="caption">MXN</Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
          <CardLogoComponent sx={{ width: 25, height: 25 }} />
          <Typography textAlign={'center'} variant="body1">
            {movement?.description}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
        spacing={1}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Box />
        <Typography variant="subtitle1" color={'text.secondary'}>
          Detalles de la Transacción
        </Typography>

        <Stack flex={1} width={1} spacing={1}>
          <Stack justifyContent={'space-between'} direction={'row'}>
            <Typography variant="subtitle2">Comercio:</Typography>
            <Box component={'span'} color={'primary.light'} fontWeight={'bold'}>
              {movement?.commerceName}
            </Box>
          </Stack>

          <Stack justifyContent={'space-between'} direction={'row'}>
            <Typography variant="subtitle2">Terminal:</Typography>
            <Box component={'span'} color={'primary.main'} fontWeight={'bold'}>
              {movement?.terminalName}
            </Box>
          </Stack>

          <Stack justifyContent={'space-between'} direction={'row'}>
            <Typography variant="subtitle2">No. Referencia:</Typography>
            <Box component={'span'} color={'primary.main'} fontWeight={'bold'}>
              {movement?.id}
            </Box>
          </Stack>

          <Stack justifyContent={'space-between'} direction={'row'}>
            <Typography variant="subtitle2">No. Autorización:</Typography>
            <Box component={'span'} color={'primary.main'} fontWeight={'bold'}>
              {movement?.authNumber}
            </Box>
          </Stack>
          <Stack justifyContent={'space-between'} direction={'row'}>
            <Typography variant="subtitle2">Fecha:</Typography>
            <Box component={Typography} variant="subtitle2" color={'text.primary'}>
              {movement?.transactionDate?.fullDate}
            </Box>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
        spacing={1}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Box />
        <Typography variant="subtitle1" color={'text.secondary'}>
          Liquidación
        </Typography>

        <Stack flex={1} width={1} spacing={1}>
          <Stack justifyContent={'space-between'} direction={'row'}>
            <Typography variant="subtitle2">Monto:</Typography>
            <Box component={'span'} fontWeight={'bold'}>
              {movement?.amountFormat}
            </Box>
          </Stack>

          <Stack justifyContent={'space-between'} direction={'row'}>
            <Typography variant="subtitle2">Comisión:</Typography>
            <Box component={'span'} color={'error.main'} fontWeight={'bold'}>
              -{movement?.commission}
            </Box>
          </Stack>

          <Stack justifyContent={'space-between'} direction={'row'}>
            <Typography variant="subtitle2">Monto a Liquidar:</Typography>
            <Box component={'span'} color={'success.main'} fontWeight={'bold'}>
              {movement?.amountToLiquidateFormat}
            </Box>
          </Stack>
        </Stack>
        <Stack width={1} pt={2}>
          <LoadingButton
            loading={isLoading}
            size="large"
            fullWidth
            variant="contained"
            onClick={handleLiquidateMovement}
          >
            Liquidar
          </LoadingButton>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default LiquidateTerminalMovementForm

LiquidateTerminalMovementForm.propTypes = {
  movement: PropTypes.shape({
    amount: PropTypes.any,
    amountFormat: PropTypes.any,
    amountToLiquidateFormat: PropTypes.any,
    authNumber: PropTypes.any,
    cardType: PropTypes.any,
    commerceName: PropTypes.any,
    commission: PropTypes.any,
    dataToLiquidate: PropTypes.any,
    description: PropTypes.any,
    id: PropTypes.any,
    terminalName: PropTypes.any,
    transactionDate: PropTypes.shape({
      fullDate: PropTypes.any
    })
  }),
  onSuccess: PropTypes.func
}
