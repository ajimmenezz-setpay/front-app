import PropTypes from 'prop-types'

import { Box, Stack, Typography } from '@mui/material'

import { CardViaboSpeiStyle } from '@/app/business/viabo-spei/shared/components'

export const AdminSpeiBalanceCard = ({ title, value, transactions, icon }) => (
  <Box display={'flex'} component={CardViaboSpeiStyle} variant="outlined" flexDirection={'column'} p={3}>
    <Stack justifyContent={'space-between'} flexDirection={'row'}>
      <Typography variant="subtitle1" color={'text.secondary'}>
        {title}
      </Typography>
      {icon}
    </Stack>
    <Typography sx={{ typography: 'h4' }}>{value}</Typography>
    <Typography sx={{ typography: 'subtitle2', fontWeight: 500 }}>{transactions} Transacciones</Typography>
  </Box>
)

AdminSpeiBalanceCard.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.any,
  transactions: PropTypes.any,
  value: PropTypes.any
}
