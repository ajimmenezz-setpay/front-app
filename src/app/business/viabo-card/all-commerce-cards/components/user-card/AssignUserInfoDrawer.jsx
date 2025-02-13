import { lazy } from 'react'

import PropTypes from 'prop-types'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'

const CardUserInfoForm = Lodable(lazy(() => import('./CardUserInfoForm')))

const AssignUserInfoDrawer = ({ open, handleClose, handleSuccess }) => (
  <RightPanel open={open} handleClose={handleClose} title={'Editar Usuario'}>
    {open && <CardUserInfoForm handleSuccess={handleClose} />}
  </RightPanel>
)

AssignUserInfoDrawer.propTypes = {
  handleClose: PropTypes.any,
  handleSuccess: PropTypes.any,
  open: PropTypes.any
}

export default AssignUserInfoDrawer
