import { lazy } from 'react'

import { Stack, Typography } from '@mui/material'

import { useViaboPayLiquidatedMovementsStore } from '../../../store'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'
import { Scrollbar } from '@/shared/components/scroll'

const LiquidateTerminalMovementForm = Lodable(lazy(() => import('./LiquidateTerminalMovementForm')))

const LiquidateTerminalMovementDrawer = () => {
  const movement = useViaboPayLiquidatedMovementsStore(state => state.movement)
  const open = useViaboPayLiquidatedMovementsStore(state => state.openDrawerLiquidateMovement)
  const { setMovementToLiquidate, setOpenDrawerLiquidateMovement } = useViaboPayLiquidatedMovementsStore(state => state)

  const handleClose = () => {
    setOpenDrawerLiquidateMovement(false)
    setMovementToLiquidate(null)
  }

  return (
    <RightPanel
      open={open}
      handleClose={handleClose}
      titleElement={
        <Stack spacing={0.5}>
          <Typography variant="h6" gutterBottom>
            {`Liquidar Movimiento`}
          </Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        {open && <LiquidateTerminalMovementForm movement={movement} onSuccess={handleClose} />}
      </Scrollbar>
    </RightPanel>
  )
}

export default LiquidateTerminalMovementDrawer
