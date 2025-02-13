import PropTypes from 'prop-types'

import { LocationOnTwoTone } from '@mui/icons-material'
import { Alert, AlertTitle, Box, Button } from '@mui/material'

import { LocationIllustration } from '../illustrations'

const LocationDisabled = ({
  titleMessage,
  errorMessage,
  severity = 'warning',
  widthImage = '60%',
  handleClick,
  ...others
}) => (
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
    <LocationIllustration sx={{ width: widthImage, mt: 5 }} />
    <Button size="large" sx={{ mt: 5 }} variant="outlined" startIcon={<LocationOnTwoTone />} onClick={handleClick}>
      Habilitar Ubicación
    </Button>
  </Box>
)

LocationDisabled.propTypes = {
  errorMessage: PropTypes.any,
  severity: PropTypes.string,
  titleMessage: PropTypes.any,
  widthImage: PropTypes.string,
  handleClick: PropTypes.func
}

export default LocationDisabled
