import { lazy } from 'react'

import { Stack, Typography } from '@mui/material'

import { useCardsOfCardCloudStore } from '../../../cards/store'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'
import { Scrollbar } from '@/shared/components/scroll'

const CardCloudAddCardToCardHolderForm = Lodable(lazy(() => import('./CardCloudAddCardToCardHolderForm')))

const CardCloudAddCardToCardHolderDrawer = () => {
  const { setOpenAddNewCard } = useCardsOfCardCloudStore()
  const { openAddNewCard } = useCardsOfCardCloudStore()

  const open = !!openAddNewCard

  const handleClose = () => {
    setOpenAddNewCard(false)
  }

  return (
    <RightPanel
      open={open}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>Agregar Nueva Tarjeta</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack p={3}>{open && <CardCloudAddCardToCardHolderForm onSuccess={handleClose} />}</Stack>
      </Scrollbar>
    </RightPanel>
  )
}

export default CardCloudAddCardToCardHolderDrawer
