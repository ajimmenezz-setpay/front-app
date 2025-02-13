import { lazy, useEffect } from 'react'

import { DoneAll } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Stack, Typography } from '@mui/material'

import { useFindTicketConversation, useFinishSupportTicket } from '../../hooks'
import { useTicketSupportListStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'

const TicketConversationLayout = Lodable(lazy(() => import('./TicketConversationLayout')))

const TicketSupportConversationDrawer = () => {
  const { openTicketConversation, setOpenTicketConversation, ticket, setSupportTicketDetails, canCloseTicket } =
    useTicketSupportListStore()

  const queryTicketConversation = useFindTicketConversation(ticket?.id, { enabled: !!ticket?.id })

  const { mutate: finishTicket, isLoading: isFinishingTicket } = useFinishSupportTicket()

  const { isLoading, error, isError, refetch, data, fetchNextPage } = queryTicketConversation

  useEffect(() => {
    if (openTicketConversation && ticket?.id) {
      refetch()
    }
  }, [openTicketConversation, ticket?.id])

  const handleClose = () => {
    setOpenTicketConversation(false)
    setSupportTicketDetails(null)
  }

  const handleFinishSupportTicket = () => {
    finishTicket(
      { ticketId: ticket?.id },
      {
        onSuccess: () => {
          handleClose()
        }
      }
    )
  }

  return (
    <RightPanel
      open={openTicketConversation}
      handleClose={handleClose}
      titleElement={
        <Stack justifyContent={'space-between'} flex={1} flexDirection={'column'} gap={1}>
          <Stack>
            <Typography variant={'h6'}>{`Ticket #${ticket?.id}`}</Typography>
          </Stack>
          {ticket && data && canCloseTicket && ticket?.status?.id !== '3' && (
            <Stack maxWidth={'30%'}>
              <LoadingButton
                endIcon={<DoneAll />}
                variant="contained"
                onClick={handleFinishSupportTicket}
                loading={isLoading || isFinishingTicket}
                color="success"
                // sx={{ typography: 'subtitle1' }}
              >
                Concluir
              </LoadingButton>
            </Stack>
          )}
        </Stack>
      }
      width={{ sm: '100%', lg: '50%', xl: '40%' }}
    >
      {isError && !isLoading && (
        <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
          <Stack spacing={3} p={3}>
            <ErrorRequestPage
              errorMessage={error}
              titleMessage={'Conversación del Ticket'}
              handleButton={() => refetch()}
            />
          </Stack>
        </Scrollbar>
      )}

      {!isError && openTicketConversation && (
        <TicketConversationLayout queryTicketConversation={queryTicketConversation} ticket={ticket} />
      )}
    </RightPanel>
  )
}

export default TicketSupportConversationDrawer
