import PropTypes from 'prop-types'

import { Box, Typography } from '@mui/material'

import { EmptyDataIllustration } from '@/shared/components/illustrations'

EmptyList.propTypes = {
  message: PropTypes.string
}
export default function EmptyList({ message, widthImage = '60%', ...others }) {
  return (
    <Box
      justifyContent="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ height: '100%' }}
      {...others}
    >
      <Typography variant="subtitle1" textTransform="capitalize">
        {message}
      </Typography>
      <EmptyDataIllustration sx={{ width: widthImage }} />
    </Box>
  )
}
