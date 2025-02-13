import { lazy, useRef } from 'react'

import { Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'

import { useCardsOfCardCloudStore } from '../../../cards/store'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'
import { TwoAuthDisabled } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'
import { useUser } from '@/shared/hooks'
import { isFunction } from '@/shared/utils'

const CardCloudBuyVirtualCardForm = Lodable(lazy(() => import('./CardCloudBuyVirtualCardForm')))
const CardCloudBuyVirtualCardSuccess = Lodable(lazy(() => import('./CardCloudBuyVirtualCardSuccess')))

const CardCloudBuyVirtualCardDrawer = ({ cards, onSuccess }) => {
  const { twoAuth } = useUser()
  const { setOpenBuyVirtualCard } = useCardsOfCardCloudStore()
  const { selectedCard, openBuyVirtualCard } = useCardsOfCardCloudStore()
  const transaction = useRef(null)

  const open = !!openBuyVirtualCard

  const handleClose = () => {
    setOpenBuyVirtualCard(false)
    transaction.current = null
  }

  const handleSuccess = data => {
    transaction.current = data
    isFunction(onSuccess) && onSuccess(data)
  }

  return (
    <RightPanel
      open={open}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>Comprar Tarjeta Virtual</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack p={3}>
          {!twoAuth && open && (
            <TwoAuthDisabled
              titleMessage={'Google Authenticator'}
              errorMessage={
                'Para realizar esta operación debe activar y configurar el Doble Factor de Autentificación (2FA) desde su perfil.'
              }
            />
          )}
          {twoAuth && open && !transaction.current && (
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <CardCloudBuyVirtualCardForm
                onCancel={handleClose}
                cards={cards}
                selectedCard={selectedCard}
                onSuccess={handleSuccess}
              />
            </motion.div>
          )}
          {twoAuth && open && transaction.current && (
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <CardCloudBuyVirtualCardSuccess transaction={transaction.current} onClose={handleClose} />
            </motion.div>
          )}
        </Stack>
      </Scrollbar>
    </RightPanel>
  )
}

export default CardCloudBuyVirtualCardDrawer
