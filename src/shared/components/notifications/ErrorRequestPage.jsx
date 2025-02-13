import PropTypes from 'prop-types'

import { Alert, AlertTitle, Box, Button } from '@mui/material'

import { ErrorRequestIllustration } from '@/shared/components/illustrations'

ErrorRequestPage.propTypes = {
  handleButton: PropTypes.func,
  errorMessage: PropTypes.string,
  titleMessage: PropTypes.string,
  errorTextButton: PropTypes.string,
  severity: PropTypes.string
}

export function ErrorRequestPage({
  handleButton,
  titleMessage,
  errorMessage,
  errorTextButton = 'Recargar',
  severity = 'error',
  widthImage = '60%',
  ...others
}) {
  return (
    <Box
      justifyContent="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ height: '100%' }}
      {...others}
    >
      <Alert
        severity={severity}
        sx={{ width: 1 }}
        action={
          <Button color="inherit" size="small" onClick={handleButton}>
            {errorTextButton}
          </Button>
        }
      >
        {titleMessage && <AlertTitle>{titleMessage}</AlertTitle>}
        {errorMessage}
      </Alert>
      <ErrorRequestIllustration sx={{ width: widthImage, mt: 5 }} />
    </Box>
  )
}
