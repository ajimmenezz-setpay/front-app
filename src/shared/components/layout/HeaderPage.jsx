import PropTypes from 'prop-types'

import { Add } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { SimpleBreadcrumbs } from '@/shared/components/breadcrumbs'

HeaderPage.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string.isRequired,
  buttonName: PropTypes.string,
  to: PropTypes.string,
  loading: PropTypes.bool,
  buttons: PropTypes.object
}

export function HeaderPage({ name, buttonName, to = '', onClick, loading = false, buttons, links = [] }) {
  return (
    <Stack py={3} gap={1} flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4">{name}</Typography>
        <SimpleBreadcrumbs links={links} />
      </Box>
      <Box sx={{ flex: '1 1 auto' }} />

      {buttons}

      {buttonName && (
        <>
          {to === '' ? (
            <LoadingButton loading={loading} variant="contained" onClick={onClick} startIcon={<Add />}>
              {buttonName}
            </LoadingButton>
          ) : (
            <Button variant="contained" component={RouterLink} to={to} startIcon={<Add />}>
              {buttonName}
            </Button>
          )}
        </>
      )}
    </Stack>
  )
}
