import { alpha, CardHeader, Paper, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'

import { useTerminalDetails, useTerminals } from '../../store'
import { TerminalActions } from '../terminal/TerminalActions'

import { varSlide } from '@/shared/components/animate'

export const TerminalBalance = () => {
  const terminal = useTerminalDetails(state => state.terminal)
  const balance = useTerminals(state => state.balance)
  const name = terminal ? terminal?.name : 'Global'

  return (
    <AnimatePresence>
      {!!terminal?.id && (
        <motion.div {...varSlide().inLeft}>
          <Paper
            variant="outlined"
            sx={{
              background: 'inherit',
              boxShadow: theme => `0px 0px 15px 2px ${alpha(theme.palette.primary.main, 0.4)}`
            }}
          >
            <CardHeader
              title={
                <Stack flexDirection={'column'} gap={1}>
                  <Typography variant="subtitle1">{name}</Typography>
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

            {terminal?.isVirtual && <TerminalActions />}
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
