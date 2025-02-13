import PropTypes from 'prop-types'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Alert, Box, Card, Collapse, Stack, Typography } from '@mui/material'

import { DetailsComponents, SuccessIconDetails, WarningIconDetails } from './DetailsComponents'

DetailsCardLayout.propTypes = {
  alertText: PropTypes.string,
  available: PropTypes.bool,
  children: PropTypes.node,
  expanded: PropTypes.string,
  expandedText: PropTypes.string,
  handleChange: PropTypes.func,
  headerText: PropTypes.string,
  step: PropTypes.string,
  showIfNotAvailable: PropTypes.bool
}

export function DetailsCardLayout({
  children,
  expandedText,
  expanded,
  handleChange,
  headerText,
  alertText,
  available = true,
  step,
  showIfNotAvailable = false
}) {
  const isExpanded = Boolean(expanded === expandedText)

  return (
    <Card
      sx={theme => ({
        p: 3,
        border: isExpanded ? 3 : 0,
        borderColor: isExpanded
          ? theme.palette.mode === 'dark'
            ? theme.palette.secondary.main
            : theme.palette.primary.main
          : 'inherit'
      })}
    >
      <Stack display="flex" flexDirection={'row'} alignItems="center">
        <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
          {available ? (
            <SuccessIconDetails widthWrapper={25} heightWrapper={25} opacity={0.2} sx={{ width: 15, height: 15 }} />
          ) : (
            <WarningIconDetails />
          )}
          <Typography variant="subtitle1" color="textPrimary">
            {headerText}
          </Typography>
        </Stack>

        <Box sx={{ flex: '1 1 auto' }} />
        <DetailsComponents
          expand={isExpanded}
          onClick={() => {
            handleChange(expandedText)
          }}
          aria-expanded={isExpanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </DetailsComponents>
      </Stack>
      <Collapse in={isExpanded} timeout="auto">
        {!available && !showIfNotAvailable ? (
          <Alert sx={{ mt: 3 }} severity="warning" variant={'filled'}>
            <Typography variant="body2">{alertText}</Typography>
            <Typography variant="caption">
              Etapa de registro: <b>{step ?? 'Registro'}</b>
            </Typography>
          </Alert>
        ) : (
          children
        )}
      </Collapse>
    </Card>
  )
}
