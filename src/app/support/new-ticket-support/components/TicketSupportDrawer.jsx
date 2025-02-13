import { lazy, useEffect } from 'react'

import PropTypes from 'prop-types'

import { Stack, Typography } from '@mui/material'

import { useFindTicketCausesByProfile } from '../hooks'

import { RightPanel } from '@/app/shared/components'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import EmptyList from '@/shared/components/notifications/EmptyList'
import { Scrollbar } from '@/shared/components/scroll'

const TicketSupportForm = Lodable(lazy(() => import('./TicketSupportForm')))

const TicketSupportDrawer = ({ open, setOpen }) => {
  const { data: causes, isLoading, isError, error, refetch } = useFindTicketCausesByProfile({ enabled: false })

  useEffect(() => {
    if (open) {
      refetch()
    }
  }, [open])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <RightPanel
      open={open}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>{'Nuevo Ticket de Soporte'}</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack spacing={3} p={3}>
          {isLoading && <RequestLoadingComponent />}
          {isError && !isLoading && (
            <ErrorRequestPage errorMessage={error} titleMessage={'Lista de Causas'} handleButton={() => refetch()} />
          )}
          {!isError && !isLoading && open && causes?.length === 0 && (
            <EmptyList
              message={'Por el momento no se puede generar un ticket de soporte , No tiene causas asignadas'}
            />
          )}
          {!isError && !isLoading && open && causes?.length > 0 && (
            <TicketSupportForm causes={causes} onSuccess={handleClose} />
          )}
        </Stack>
      </Scrollbar>
    </RightPanel>
  )
}

TicketSupportDrawer.propTypes = {
  open: PropTypes.any,
  setOpen: PropTypes.func
}

export default TicketSupportDrawer
