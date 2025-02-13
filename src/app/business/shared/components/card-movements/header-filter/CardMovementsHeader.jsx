import PropTypes from 'prop-types'

import { CurrencyExchangeOutlined } from '@mui/icons-material'
import { Box, Button, Stack } from '@mui/material'

import { InputDateRange } from '@/shared/components/form'

const CardMovementsHeader = ({
  startDate,
  endDate,
  onChangeDateRange,
  loading,
  onOpenBalance,
  hideBalance = false
}) => (
  <>
    <Stack py={2} px={1} flexDirection={{ lg: 'row' }} justifyContent={'space-between'} alignItems={'center'} gap={1}>
      <Stack flex={1} width={1} direction={'row'} spacing={0.5}>
        <InputDateRange startDate={startDate} endDate={endDate} onSubmit={onChangeDateRange} />
      </Stack>

      <Box display={'flex'} flexGrow={1} />
      <Box display={'flex'} flexGrow={1} justifyContent={'flex-end'}>
        {!hideBalance && (
          <Button
            variant="contained"
            color="secondary"
            disabled={Boolean(loading)}
            startIcon={<CurrencyExchangeOutlined />}
            sx={{ color: 'text.primary', fontWeight: 'bolder' }}
            onClick={onOpenBalance}
          >
            Ver Balance del Periodo
          </Button>
        )}
      </Box>
    </Stack>
  </>
)

CardMovementsHeader.propTypes = {
  endDate: PropTypes.any.isRequired,
  loading: PropTypes.any,
  onChangeDateRange: PropTypes.func.isRequired,
  onOpenBalance: PropTypes.func,
  startDate: PropTypes.any.isRequired,
  hideBalance: PropTypes.bool
}

export default CardMovementsHeader
