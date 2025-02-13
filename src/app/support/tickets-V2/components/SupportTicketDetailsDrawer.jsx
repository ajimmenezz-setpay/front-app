import React from 'react'

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import { Button, Divider, Stack, styled, Typography } from '@mui/material'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary'

import { TicketCauseLabel } from '../../new-ticket-support/components/TicketCauseLabel'
import { useFindSupportTicketDetails } from '../hooks'
import { useSupportTicketsV2Store } from '../store'

import { RightPanel } from '@/app/shared/components'
import { Label } from '@/shared/components/form'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'

const Accordion = styled(props => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  boxShadow: 'none',
  // display: 'flex',
  width: '100%',
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&.Mui-expanded': {
    boxShadow: 'none',
    borderRadius: 0
  }

  // '&::before': {
  //   display: 'none'
  // }
}))

const AccordionSummary = styled(props => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: 'rotate(90deg)'
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1)
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)'
  })
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}))

const SupportTicketDetailsDrawer = () => {
  const { setOpenTicketDetails, setSelectedTicket } = useSupportTicketsV2Store()
  const { openTicketDetails, selectedTicket } = useSupportTicketsV2Store()

  const open = !!openTicketDetails
  const ticketID = selectedTicket?.id
  const { isLoading, isError, error, data, refetch } = useFindSupportTicketDetails(ticketID, {
    enabled: Boolean(open && ticketID)
  })

  const handleClose = () => {
    setOpenTicketDetails(false)
    setSelectedTicket(null)
  }

  const movement = data?.movement

  return (
    <RightPanel
      open={Boolean(open)}
      handleClose={handleClose}
      titleElement={<Typography variant="h6">Detalles del Ticket</Typography>}
    >
      {isLoading && <RequestLoadingComponent sx={{ p: 4 }} />}

      {isError && !isLoading && (
        <ErrorRequestPage
          sx={{ p: 3 }}
          errorMessage={error}
          titleMessage={'Información de Tarjeta'}
          handleButton={() => {
            refetch()
          }}
        />
      )}
      {!isLoading && !isError && (
        <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
          <Stack>
            <Accordion defaultExpanded>
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Typography component="span">Ticket</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack
                  gap={1}
                  p={3}
                  divider={<Divider orientation="horizontal" flexItem sx={{ borderStyle: 'dashed' }} />}
                >
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      ID
                    </Typography>
                    <Typography variant="overline">{data?.id}</Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Titulo
                    </Typography>
                    <Typography variant="overline">{data?.title}</Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Descripción
                    </Typography>
                    <Typography component={'p'} sx={{ textWrap: 'balance', textAlign: 'right' }} variant="overline">
                      {data?.description}
                    </Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estado
                    </Typography>
                    <TicketCauseLabel variant="ghost" color={data?.status?.color}>
                      {data?.status?.name?.toUpperCase()}
                    </TicketCauseLabel>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fecha Creación
                    </Typography>
                    <Typography variant="overline">{data?.createdAt?.format}</Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fecha Actualización
                    </Typography>
                    <Typography variant="overline">{data?.updatedAt?.format}</Typography>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <Typography component="span">Movimiento</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack
                  gap={1}
                  p={3}
                  divider={<Divider orientation="horizontal" flexItem sx={{ borderStyle: 'dashed' }} />}
                >
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      ID
                    </Typography>
                    <Typography variant="overline">{movement?.id}</Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Client_ID
                    </Typography>
                    <Typography variant="overline">{movement?.clientID}</Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Código de Autorización
                    </Typography>
                    <Typography variant="overline">{movement?.authCode}</Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Descripción
                    </Typography>
                    <Typography component={'p'} sx={{ textWrap: 'balance', textAlign: 'right' }} variant="overline">
                      {movement?.description}
                    </Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estado
                    </Typography>
                    <Label variant="ghost" color={movement?.status?.color?.replace('.main', '') || 'info'}>
                      {movement?.status?.name?.toUpperCase()}
                    </Label>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Monto
                    </Typography>
                    <Typography variant="overline">{movement?.amount?.format}</Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Balance
                    </Typography>
                    <Typography variant="overline">{movement?.balance?.format}</Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tipo de Movimiento
                    </Typography>
                    <Typography variant="overline">{movement?.type}</Typography>
                  </Stack>
                  <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} gap={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fecha
                    </Typography>
                    <Typography variant="overline">{movement?.date?.dateTime}</Typography>
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Stack sx={{ p: 3 }} gap={3}>
              <Button color="inherit" variant="outlined" size="large" fullWidth onClick={handleClose}>
                Cerrar
              </Button>
            </Stack>
          </Stack>
        </Scrollbar>
      )}
    </RightPanel>
  )
}

export default SupportTicketDetailsDrawer
