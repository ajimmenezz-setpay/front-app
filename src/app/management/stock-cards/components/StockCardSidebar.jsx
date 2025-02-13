import { useEffect } from 'react'

import { Close } from '@mui/icons-material'
import { Backdrop, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useSettings } from '@theme/hooks'
import { NAVBAR } from '@theme/overrides/options'
import { AnimatePresence } from 'framer-motion'

import { StockCardForm } from '@/app/management/stock-cards/components/StockCardForm'
import { RightPanelStyle } from '@/app/shared/components'
import { varFade } from '@/shared/components/animate'

export function StockCardSidebar({ open, setOpen }) {
  const { themeDirection } = useSettings()

  const varSidebar =
    themeDirection !== 'rtl'
      ? varFade({
          distance: NAVBAR.BASE_WIDTH,
          durationIn: 0.32,
          durationOut: 0.32
        }).inRight
      : varFade({
          distance: NAVBAR.BASE_WIDTH,
          durationIn: 0.32,
          durationOut: 0.32
        }).inLeft

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Backdrop
        open={open}
        onClick={handleClose}
        sx={{ background: 'transparent', zIndex: theme => theme.zIndex.drawer + 1 }}
      />

      <AnimatePresence>
        {open && (
          <>
            <RightPanelStyle {...varSidebar}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
                <Typography variant="subtitle1">Nueva Tarjeta</Typography>
                <div>
                  <IconButton aria-label="close" size="medium" onClick={handleClose}>
                    <Close width={20} height={20} fontSize="inherit" color="primary" />
                  </IconButton>
                </div>
              </Stack>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <StockCardForm setOpen={setOpen} />
            </RightPanelStyle>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
