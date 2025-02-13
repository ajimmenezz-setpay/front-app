import PropTypes from 'prop-types'

import { AccountBalance, Check, Clear } from '@mui/icons-material'
import { Avatar, Box, Tooltip, Typography } from '@mui/material'

import { getCardTypeByName } from '@/app/shared/services'

export const TerminalMovementColumn = ({ row }) => {
  const { original: rowData } = row

  const approved = rowData?.approved
  const cardLogo = getCardTypeByName(rowData?.cardType)
  const CardLogoComponent = cardLogo?.component

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Tooltip title={rowData?.cardType}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              color: 'text.secondary',
              bgcolor: 'background.neutral'
            }}
          >
            {cardLogo ? (
              <CardLogoComponent sx={{ width: 25, height: 25 }} />
            ) : (
              <AccountBalance width={25} height={25} />
            )}
          </Avatar>
        </Tooltip>
        <Box
          sx={{
            right: 0,
            bottom: 0,
            width: 15,
            height: 15,
            display: 'flex',
            borderRadius: '50%',
            position: 'absolute',
            alignItems: 'center',
            color: 'common.white',
            bgcolor: 'error.main',
            justifyContent: 'center',
            ...(approved && {
              bgcolor: 'success.main'
            })
          }}
        >
          {approved ? <Check sx={{ width: 12, height: 12 }} /> : <Clear sx={{ width: 12, height: 12 }} />}
        </Box>
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2" sx={{ textWrap: 'wrap' }}>
          {rowData?.description}
        </Typography>
        <Typography
          variant="body2"
          textTransform={'capitalize'}
          sx={{ color: approved ? 'success.main' : 'error.main', textWrap: 'wrap' }}
        >
          {rowData?.transactionMessage}
        </Typography>
      </Box>
    </Box>
  )
}

TerminalMovementColumn.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      approved: PropTypes.bool,
      cardType: PropTypes.any,
      description: PropTypes.any,
      transactionMessage: PropTypes.any
    })
  })
}
