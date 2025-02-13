import { Box, Card, CardHeader, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'

import { useTerminalDetails, useTerminals } from '../../store'

export const TerminalGlobalBalance = () => {
  const balance = useTerminals(state => state.globalBalance)
  const resetTerminal = useTerminalDetails(state => state.resetTerminal)
  const terminal = useTerminalDetails(state => state.terminal)
  const handleClose = () => {
    resetTerminal()
  }

  if (terminal) {
    return (
      <AnimatePresence>
        <motion.div onClick={handleClose} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.8 }}>
          <Card
            variant="outlined"
            sx={theme => ({
              cursor: 'pointer',
              backgroundColor: 'inherit',
              '& :hover': {
                color: 'primary.main'
              }
            })}
          >
            <CardHeader
              title={
                <Stack flexDirection={'row'} gap={1} justifyContent={'space-between'}>
                  <Typography variant="subtitle1">Global</Typography>
                  <Stack direction={'row'} spacing={1} alignItems={'center'}>
                    <Typography variant="caption">{balance.amount}</Typography>
                    <Typography variant="caption">MXN</Typography>
                  </Stack>
                </Stack>
              }
              sx={{ px: 2, py: 2 }}
            />
          </Card>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <Box
        component={motion.div}
        sx={{
          '& :hover': {
            backgroundColor: theme =>
              theme.palette.mode === 'light' ? theme.palette.grey.A100 : theme.palette.background.neutral
          }
        }}
        onClick={handleClose}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.8 }}
      >
        <Card
          variant="outlined"
          sx={theme => ({
            cursor: 'pointer',
            backgroundColor: 'inherit',
            '& :hover': {
              color: 'primary.main'
            }
          })}
        >
          <CardHeader
            title={
              <Stack flexDirection={'column'} gap={1}>
                <Typography variant="subtitle1">Global</Typography>
              </Stack>
            }
            sx={{ px: 2, py: 2 }}
          />

          <Stack alignItems={'center'} pb={2} px={2}>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <Typography variant="h3">{balance.amount}</Typography>
              <Typography variant="caption">MXN</Typography>
            </Stack>

            {balance?.month && <Typography variant="subtitle2">Balance de {balance.month}</Typography>}
          </Stack>
        </Card>
      </Box>
    </AnimatePresence>
  )
}
