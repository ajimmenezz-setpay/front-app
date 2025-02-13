import PropTypes from 'prop-types'

import { Alert, Box, Button, Card, CardHeader, Divider, LinearProgress, Stack, Typography } from '@mui/material'
import { TbCreditCardPay, TbReportAnalytics } from 'react-icons/tb'

import { FundingCardsMenu } from './funding'

import { useCardCloudSharedStore } from '../../shared/store'
import { useCardCloudDashboardStore } from '../store'

import { CircularLoading } from '@/shared/components/loadings'

const CardCloudSubAccounts = ({ queryCardCloudSubAccountInfo, isLoadingCompanies, isEmptyCompanies }) => {
  const setOpenMovements = useCardCloudDashboardStore(state => state.setOpenMovements)
  const setOpenTransfer = useCardCloudSharedStore(state => state.setOpenTransfer)

  const { isFetching: isLoadingSubAccount, data: subAccount } = queryCardCloudSubAccountInfo

  const isEmptyAccount = !subAccount?.subAccountId

  return (
    <Box
      display={'flex'}
      component={Card}
      variant="outlined"
      sx={{ backdropFilter: `blur(10px)`, WebkitBackdropFilter: `blur(10px)`, background: 'inherit' }}
      flexDirection={'column'}
    >
      <CardHeader
        sx={{ p: 2 }}
        title={
          <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant={'h6'}>{'Subcuenta'}</Typography>
            </Box>
          </Stack>
        }
      />
      <Divider />
      <Stack sx={{ p: 0 }}>
        {isLoadingCompanies && (
          <Stack justifyContent={'center'} alignItems={'center'} p={4}>
            <CircularLoading />
          </Stack>
        )}
        {isEmptyCompanies && !isLoadingCompanies && (
          <Stack p={3}>
            <Alert severity="info">No Hay Empresas Asignadas al Servicio Card Cloud</Alert>
          </Stack>
        )}
        {!isEmptyCompanies && !isLoadingCompanies && (
          <>
            {isLoadingSubAccount && <LinearProgress />}
            <Stack gap={4} p={4}>
              <Stack gap={1}>
                <Stack flex={1}>
                  <Typography sx={{ typography: 'subtitle2' }}>Balance</Typography>
                  <Stack direction={'row'} alignItems={'center'} spacing={1}>
                    <Typography variant="h3">{subAccount?.wallet?.balance?.format ?? '$0.00'}</Typography>
                    <Typography variant="caption">MXN</Typography>
                  </Stack>
                </Stack>

                <Stack justifyContent={'space-between'} flexDirection={'row'} flexWrap={'wrap'}>
                  <Stack flex={1}>
                    <Typography sx={{ typography: 'subtitle2' }}>Descripción</Typography>
                    <Typography sx={{ typography: 'subtitle1' }}>{subAccount?.description ?? '-'}</Typography>
                  </Stack>

                  <Stack flex={1}>
                    <Typography sx={{ typography: 'subtitle2' }}>Clabe</Typography>
                    <Typography sx={{ typography: 'subtitle1' }}>{subAccount?.wallet?.clabe ?? '-'}</Typography>
                  </Stack>
                </Stack>
              </Stack>
              {!isEmptyAccount && (
                <Stack gap={2} flex={1}>
                  <Button
                    size="large"
                    variant="outlined"
                    sx={{ color: 'text.primary' }}
                    onClick={() => setOpenTransfer(true)}
                    startIcon={<TbCreditCardPay style={{ fontSize: 18 }} />}
                  >
                    Dispersar
                  </Button>
                  <Button
                    size="large"
                    variant="outlined"
                    sx={{ color: 'text.primary' }}
                    onClick={() => setOpenMovements(true)}
                    startIcon={<TbReportAnalytics style={{ fontSize: 18 }} />}
                  >
                    Detalles Movimientos
                  </Button>
                  <FundingCardsMenu subAccount={subAccount} />
                </Stack>
              )}
            </Stack>
            {isLoadingSubAccount && <LinearProgress />}
          </>
        )}
      </Stack>
    </Box>
  )
}

CardCloudSubAccounts.propTypes = {
  isEmptyCompanies: PropTypes.any,
  isLoadingCompanies: PropTypes.any,
  queryCardCloudSubAccountInfo: PropTypes.shape({
    data: PropTypes.shape({
      description: PropTypes.string,
      subAccountId: PropTypes.any,
      wallet: PropTypes.shape({
        balance: PropTypes.shape({
          format: PropTypes.string
        }),
        clabe: PropTypes.string
      })
    }),
    isFetching: PropTypes.any
  })
}

export default CardCloudSubAccounts
