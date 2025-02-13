import PropTypes from 'prop-types'

import { Person2Rounded, Receipt } from '@mui/icons-material'
import { Box, Divider, Paper, Stack, Typography } from '@mui/material'

import { getColorStatusPaymentLinkById } from '../services/paymentLinkStatus'

import ViaboLogo from '@/shared/assets/img/viabo-pay.png'
import { Label } from '@/shared/components/form'

export const ChargePaymentLinkDetails = ({ details }) => (
  <Stack>
    <Paper sx={{ width: 1, p: 3, position: 'relative' }} variant="outlined" elevation={0}>
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          position: 'absolute',
          top: 8,
          left: 8,
          justifyContent: 'center',
          width: 100
        }}
      >
        <img src={ViaboLogo} alt={'viabo-logo'} />
      </Box>
      <Stack alignItems={'center'} justifyContent={'center'} spacing={2}>
        <Label
          variant={'ghost'}
          color={getColorStatusPaymentLinkById(details?.status?.id)}
          sx={{
            textTransform: 'uppercase'
          }}
        >
          {details?.status?.name}
        </Label>
        <Receipt color="primary" sx={{ width: 40, height: 40 }} />
        <Stack alignItems={'center'} justifyContent={'center'}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="h2"> {details?.amount}</Typography>
            <Typography variant="caption">MXN</Typography>
          </Stack>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Person2Rounded />
            <Typography variant="subtitle1" textTransform={'capitalize'}>
              {details?.name}
            </Typography>
          </Stack>
        </Stack>
        <Typography textAlign={'center'} variant="body2">
          {details?.description}
        </Typography>
      </Stack>

      {details?.status?.id === '7' && (
        <>
          <Stack
            divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
            spacing={1}
            alignItems={'center'}
            justifyContent={'center'}
            p={2}
          >
            <Box />
            <Typography variant="subtitle1" color={'text.secondary'}>
              Detalles de la Transacción
            </Typography>

            <Stack flex={1} width={1} spacing={1}>
              <Stack justifyContent={'space-between'} direction={'row'}>
                <Typography variant="subtitle2">No. Terminal:</Typography>
                <Box component={'span'} color={'primary.main'} fontWeight={'bold'}>
                  {details?.terminalId}
                </Box>
              </Stack>

              <Stack justifyContent={'space-between'} direction={'row'}>
                <Typography variant="subtitle2">No. Referencia:</Typography>
                <Box component={'span'} color={'primary.main'} fontWeight={'bold'}>
                  {details?.reference}
                </Box>
              </Stack>

              <Stack justifyContent={'space-between'} direction={'row'}>
                <Typography variant="subtitle2">No. Autorización:</Typography>
                <Box component={'span'} color={'primary.main'} fontWeight={'bold'}>
                  {details?.transaction?.authCode}
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </>
      )}
    </Paper>
  </Stack>
)

ChargePaymentLinkDetails.propTypes = {
  details: PropTypes.shape({
    amount: PropTypes.any,
    description: PropTypes.any,
    name: PropTypes.any,
    reference: PropTypes.any,
    status: PropTypes.shape({
      id: PropTypes.any,
      name: PropTypes.any
    }),
    terminalId: PropTypes.any,
    transaction: PropTypes.shape({
      authCode: PropTypes.any
    })
  })
}
