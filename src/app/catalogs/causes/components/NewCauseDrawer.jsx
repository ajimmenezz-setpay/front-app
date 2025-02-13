import { lazy } from 'react'

import PropTypes from 'prop-types'

import { Stack, Typography } from '@mui/material'

import { useCausesStore } from '../store'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'

const NewCauseForm = Lodable(lazy(() => import('./NewCauseForm')))

const NewCauseDrawer = ({ profiles }) => {
  const { openNewCause, setOpenNewCause, setCause, cause } = useCausesStore()

  const handleClose = () => {
    setOpenNewCause(false)
    setCause(null)
  }

  return (
    <RightPanel
      open={openNewCause}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>{cause ? `Editar Causa` : 'Nueva Causa'}</Typography>
        </Stack>
      }
    >
      {openNewCause && <NewCauseForm profiles={profiles} onSuccess={handleClose} cause={cause} />}
    </RightPanel>
  )
}

NewCauseDrawer.propTypes = {
  profiles: PropTypes.any
}

export default NewCauseDrawer
