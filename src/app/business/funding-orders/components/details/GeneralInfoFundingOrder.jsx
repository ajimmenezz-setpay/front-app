import { useState } from 'react'

import PropTypes from 'prop-types'

import { Check, CopyAll } from '@mui/icons-material'
import { Box, Chip, IconButton, Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { getColorFundingOrderStatusByName, getOperationTypeByName } from '@/app/shared/services'
import { Label } from '@/shared/components/form'
import { copyToClipboard } from '@/shared/utils'

export const GeneralInfoFundingOrder = ({ fundingOrder }) => {
  const [copied, setCopied] = useState(false)

  const logos = []

  const paymentMethods = fundingOrder?.paymentMethods?.split(',') || []

  const colorStatus = getColorFundingOrderStatusByName(fundingOrder?.status)

  paymentMethods?.forEach(method => {
    const methodLogo = getOperationTypeByName(method)
    if (methodLogo) {
      logos.push({
        component: methodLogo?.component,
        width: method === 'PAYCASH' ? 50 : 30,
        height: method === 'PAYCASH' ? 50 : 30
      })
    }
  })

  return (
    <Stack spacing={2}>
      <Typography variant={'subtitle1'} fontWeight={'bold'}>
        Datos de la orden
      </Typography>
      <Stack spacing={2}>
        <Stack flexDirection={'row'} gap={1}>
          <Stack spacing={0.5} flex={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Monto:
            </Typography>
            <Typography variant="body2">{fundingOrder?.amount ?? '-'}</Typography>
          </Stack>

          <Stack spacing={0.5} flex={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Referencia Interna:
            </Typography>
            <Typography variant="body2">{fundingOrder?.referenceNumber ?? '-'}</Typography>
          </Stack>
        </Stack>

        <Stack flexDirection={'row'} gap={1}>
          <Stack spacing={0.5} flex={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Cuenta Maestra:
            </Typography>
            <Typography variant="body2">{fundingOrder?.cardNumber ?? '-'}</Typography>
          </Stack>

          <Stack spacing={1.5} flex={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Métodos de Fondeo:
            </Typography>
            <Stack flexDirection={'row'} alignItems={'center'} gap={1} position={'relative'}>
              {logos?.map(({ component: Logo, width, height }, index) => (
                <Logo key={index} sx={{ width, height, position: 'absolute', left: index === 0 ? 0 : 40 }} />
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Stack flexDirection={'row'} gap={1}>
          <Stack spacing={0.5} flex={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Fecha de Creación:
            </Typography>
            <Typography variant="body2">{fundingOrder?.registerDate?.fullDate ?? '-'}</Typography>
          </Stack>

          <Stack spacing={0.5} flex={1}>
            <Typography paragraph variant="overline" gutterBottom={false} sx={{ color: 'text.disabled' }}>
              Liga Orden de Fondeo
            </Typography>
            {fundingOrder?.referenceNumber && (
              <Stack alignItems={'flex-start'} direction="row" spacing={1}>
                <Link
                  variant="body2"
                  component={RouterLink}
                  underline="always"
                  to={`/orden-fondeo/${fundingOrder?.referenceNumber}`}
                  target="_blank"
                  color="info.main"
                >
                  {`orden-fondeo/${fundingOrder?.referenceNumber}`}
                </Link>
                <Box position={'relative'}>
                  <IconButton
                    variant="outlined"
                    sx={{ position: 'absolute', p: 0 }}
                    size="small"
                    color={copied ? 'success' : 'inherit'}
                    onClick={() => {
                      setCopied(true)
                      copyToClipboard(`${window.location.host}/orden-fondeo/${fundingOrder?.referenceNumber}`)
                      setTimeout(() => {
                        setCopied(false)
                      }, 1000)
                    }}
                  >
                    {copied ? (
                      <Check fontSize="small" sx={{ color: 'success' }} />
                    ) : (
                      <CopyAll fontSize="small" sx={{ color: 'text.disabled' }} />
                    )}
                  </IconButton>
                </Box>
              </Stack>
            )}
          </Stack>
        </Stack>

        <Stack flexDirection={'row'} gap={1}>
          <Stack spacing={0.5} flex={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Destinatarios:
            </Typography>
            {fundingOrder?.emails?.length > 0 ? (
              fundingOrder?.emails?.map(email => (
                <Box key={email} display={'flex'} flexDirection={'column'}>
                  <Box>
                    <Chip label={<Typography variant="body2">{email}</Typography>} size="small" />
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2">{'-'}</Typography>
            )}
          </Stack>
          <Stack spacing={0.5} flex={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Estado:
            </Typography>
            <Box>
              <Label
                variant={'ghost'}
                color={colorStatus}
                sx={{
                  textTransform: 'capitalize'
                }}
              >
                {fundingOrder?.status || '-'}
              </Label>
            </Box>
          </Stack>
        </Stack>

        <Stack flexDirection={'row'} gap={1}>
          <Stack spacing={0.5} flex={1}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Fecha Último Estado:
            </Typography>
            <Typography variant="body2">{fundingOrder?.lastStatusDate || '-'}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

GeneralInfoFundingOrder.propTypes = {
  fundingOrder: PropTypes.shape({
    amount: PropTypes.string,
    cardNumber: PropTypes.string,
    emails: PropTypes.array,
    lastStatusDate: PropTypes.string,
    paymentMethods: PropTypes.string,
    referenceNumber: PropTypes.string,
    registerDate: PropTypes.shape({
      fullDate: PropTypes.string
    }),
    status: PropTypes.string
  })
}
