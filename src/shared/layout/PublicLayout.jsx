import PropTypes from 'prop-types'

import { Box, CssBaseline, Stack } from '@mui/material'

const PublicLayout = ({ children }) => (
  <Box sx={{ display: 'flex', height: '100dvH' }}>
    <CssBaseline />
    <Stack sx={{ overflow: 'auto', flexGrow: 1 }}>
      <Box component="main" sx={{ pb: 3, position: 'relative', height: '100%' }}>
        {children}
      </Box>
    </Stack>
  </Box>
)

PublicLayout.propTypes = {
  children: PropTypes.any
}

export default PublicLayout
