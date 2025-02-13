import { lazy, useState } from 'react'

import { CloseOutlined, Message, PriceChange } from '@mui/icons-material'
import { Button, IconButton, Stack, Toolbar, Typography } from '@mui/material'

import MailCompose from './MailCompose'

import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { Lodable } from '@/shared/components/lodables'

const TransferSideBar = Lodable(
  lazy(() => import('@/app/business/viabo-card/cards/components/transfer/TransferSideBar'))
)

export function CardToolbar() {
  const [openCompose, setOpenCompose] = useState(false)
  const [openTransferBin, setOpenTransferBin] = useState(false)
  const mainCard = useCommerceDetailsCard(state => state.mainCard)
  const setSelectedCards = useCommerceDetailsCard(state => state.setSelectedCards)

  const handleClose = () => {
    setSelectedCards([])
  }

  return (
    <>
      <Toolbar
        sx={theme => ({
          position: 'sticky',
          borderRadius: 1,
          py: 4,
          top: 0,
          boxShadow: theme.customShadows.z8,
          backgroundColor: theme.palette.info.lighter,
          color: 'white'
        })}
      >
        <Stack
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          sx={{ width: 1 }}
          gap={2}
          alignItems={'center'}
        >
          <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
            <IconButton aria-label="close" size="small" onClick={handleClose}>
              <CloseOutlined width={20} height={20} fontSize="inherit" color="primary" />
            </IconButton>
            <Typography variant="subtitle2" color="info.main">
              Acciones:
            </Typography>
          </Stack>

          <Stack flexDirection={'row'} gap={2} justifyContent="space-between">
            <Button
              startIcon={<Message />}
              variant={'outlined'}
              color={'info'}
              onClick={() => {
                setOpenCompose(true)
                setOpenTransferBin(false)
              }}
            >
              Mensaje
            </Button>
            {mainCard && (
              <Button
                startIcon={<PriceChange />}
                variant={'outlined'}
                color={'info'}
                onClick={() => {
                  setOpenTransferBin(true)
                  setOpenCompose(false)
                }}
              >
                Fondear
              </Button>
            )}
          </Stack>
        </Stack>
      </Toolbar>
      <MailCompose isOpenCompose={openCompose} onCloseCompose={() => setOpenCompose(false)} />
      <TransferSideBar open={openTransferBin} setOpen={setOpenTransferBin} isFundingCard={true} />
    </>
  )
}
