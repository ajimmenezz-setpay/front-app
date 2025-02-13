import { Stack, Toolbar, Typography } from '@mui/material'

import { useTerminalDetails } from '../../store'

export const TerminalHeader = () => {
  const terminal = useTerminalDetails(state => state.terminal)
  return (
    <Toolbar
      sx={theme => ({
        borderRadius: 1,
        position: 'relative',
        zIndex: 1,
        backgroundColor: theme.palette.primary.light,
        color: 'white',
        minHeight: 'auto!important',
        height: { xs: 'auto', sm: 'auto' }
      })}
    >
      <Stack
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        sx={{ width: 1 }}
        gap={2}
        py={2}
        alignItems={'center'}
      >
        <Stack flexDirection="column" spacing={0} alignItems={{ xs: 'center', md: 'start' }}>
          <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
            <Typography variant="subtitle2">Disponible</Typography>
          </Stack>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="h3">{terminal?.balanceFormatted}</Typography>
            <Typography variant="caption">MXN</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Toolbar>
  )
}
