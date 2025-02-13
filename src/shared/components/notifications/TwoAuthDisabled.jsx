import React from 'react'

import PropTypes from 'prop-types'

import { Alert, AlertTitle, Box } from '@mui/material'

import { TwoAuthIllustration } from '../illustrations'

const TwoAuthDisabled = ({ titleMessage, errorMessage, severity = 'warning', widthImage = '60%', ...others }) => (
  <Box
    justifyContent="center"
    display="flex"
    flexDirection="column"
    alignItems="center"
    sx={{ height: '100%' }}
    {...others}
  >
    <Alert severity={severity} sx={{ width: 1 }} variant="outlined">
      {titleMessage && <AlertTitle>{titleMessage}</AlertTitle>}
      {errorMessage}
    </Alert>
    <TwoAuthIllustration sx={{ width: widthImage, mt: 5 }} />
  </Box>
)

TwoAuthDisabled.propTypes = {
  errorMessage: PropTypes.any,
  severity: PropTypes.string,
  titleMessage: PropTypes.any,
  widthImage: PropTypes.string
}

export default TwoAuthDisabled
