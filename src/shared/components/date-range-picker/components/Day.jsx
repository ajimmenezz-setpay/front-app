import PropTypes from "prop-types"

import { Box, IconButton, Typography, alpha, useTheme } from '@mui/material'

export const Day = ({
  startOfRange,
  endOfRange,
  disabled,
  hidden,
  highlighted,
  outlined,
  filled,
  onClick,
  onHover,
  value,
  hideOutsideMonthDays = true
}) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: startOfRange ? '50% 0 0 50%' : endOfRange ? '0 50% 50% 0' : undefined,
        backgroundColor: !disabled && highlighted ? alpha(theme.palette.primary.main, 0.1) : undefined
      }}
    >
      <IconButton
        disableRipple
        color="primary"
        sx={{
          ':hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.2)
          },
          borderRadius: '8px',
          height: '36px',
          width: '36px',
          padding: 0,
          border: !disabled && outlined ? `1px solid ${theme.palette.primary.main}` : undefined,
          ...(!disabled && filled
            ? {
                '&:hover': {
                  backgroundColor: theme.palette.primary.main
                },
                backgroundColor: theme.palette.primary.main
              }
            : {})
        }}
        disabled={disabled}
        onClick={onClick}
        onMouseOver={onHover}
      >
        <Typography
          sx={{
            fontSize: '14px',
            visibility: hidden && hideOutsideMonthDays ? 'hidden' : 'visible',
            color: !disabled
              ? filled
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary
              : theme.palette.text.secondary
          }}
        >
          {value}
        </Typography>
      </IconButton>
    </Box>
  )
}

Day.propTypes = {
  disabled: PropTypes.any,
  endOfRange: PropTypes.any,
  filled: PropTypes.any,
  hidden: PropTypes.any,
  hideOutsideMonthDays: PropTypes.bool,
  highlighted: PropTypes.any,
  onClick: PropTypes.any,
  onHover: PropTypes.any,
  outlined: PropTypes.any,
  startOfRange: PropTypes.any,
  value: PropTypes.any
}
