import { lazy } from 'react'

import { GrainTwoTone, HdrStrongTwoTone } from '@mui/icons-material'
import { List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material'

import { useCardsOfCardCloudStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'
import { TwoAuthDisabled } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'
import { useUser } from '@/shared/hooks'

const CardCloudTransferBetweenCardsForm = Lodable(lazy(() => import('./CardCloudTransferBetweenCardsForm')))

const CardCloudTransferBetweenCardsDrawer = ({ onSuccess }) => {
  const { twoAuth } = useUser()
  const { setOpenTransferToCards } = useCardsOfCardCloudStore()
  const { selectedCard, openTransferToCards } = useCardsOfCardCloudStore()

  const open = !!openTransferToCards

  const handleClose = () => {
    setOpenTransferToCards(false)
  }

  return (
    <RightPanel
      open={open}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>Transferir a Tarjeta</Typography>
          <List dense={true} disablePadding>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <GrainTwoTone />
              </ListItemIcon>
              <ListItemText
                sx={{ typography: 'caption', textWrap: 'pretty' }}
                primary={'Las transferencias solo aplican para tarjetas del mismo emisor'}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <GrainTwoTone />
              </ListItemIcon>
              <ListItemText
                sx={{ typography: 'caption', textWrap: 'pretty' }}
                primary={'Las transferencias a tarjetas de otros bancos no son posibles'}
              />
            </ListItem>
          </List>
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

          {twoAuth && open && (
            <CardCloudTransferBetweenCardsForm card={selectedCard} onFinish={handleClose} onSuccess={onSuccess} />
          )}
        </Stack>
      </Scrollbar>
    </RightPanel>
  )
}

export default CardCloudTransferBetweenCardsDrawer
