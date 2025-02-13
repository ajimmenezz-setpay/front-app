import PropTypes from 'prop-types'

import { Box, Stack, Typography } from '@mui/material'
import { BiBlock } from 'react-icons/bi'
import { BsPatchCheck } from 'react-icons/bs'

export const ConciliateFundingOrderInfo = ({ fundingOrder }) => (
  <Stack spacing={2}>
    <Typography variant={'subtitle1'} fontWeight={'bold'}>
      Conciliación
    </Typography>
    <Stack spacing={2}>
      <Stack flexDirection={'row'} gap={1}>
        <Stack spacing={0.5}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            ¿Conciliada?
          </Typography>
          <Box textAlign={'center'}>
            {fundingOrder?.conciliated ? (
              <BsPatchCheck color="green" fontWeight={'bold'} fontSize={'20px'} />
            ) : (
              <BiBlock fontSize={'20px'} color="red" />
            )}
          </Box>
        </Stack>
        <Box display={'flex'} flex={1} />
        <Stack flexGrow={1} spacing={0.5}>
          {fundingOrder?.conciliationInfo?.number && fundingOrder?.conciliationInfo?.number !== '' && (
            <>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Movimiento
              </Typography>
              <Stack>
                <Typography variant="body2">{`${fundingOrder?.conciliationInfo?.number || '-'}`}</Typography>
                <Typography variant="body2">{` ${fundingOrder?.conciliationInfo?.date || '-'}`}</Typography>
                <Typography variant="body2">{` ${fundingOrder?.conciliationInfo?.userName || '-'}`}</Typography>
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  </Stack>
)

ConciliateFundingOrderInfo.propTypes = {
  fundingOrder: PropTypes.shape({
    conciliated: PropTypes.any,
    conciliationInfo: PropTypes.shape({
      date: PropTypes.any,
      number: PropTypes.string,
      userName: PropTypes.any
    })
  })
}
