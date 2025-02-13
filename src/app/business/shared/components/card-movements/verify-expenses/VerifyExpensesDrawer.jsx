import { lazy } from 'react'

import PropTypes from 'prop-types'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'

const VerifyExpensesForm = Lodable(lazy(() => import('./VerifyExpensesForm')))

const VerifyExpensesDrawer = ({ open, setOpen, movements = [] }) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <RightPanel open={open} handleClose={handleClose} titleElement={'Comprobar Gastos'}>
      {open && <VerifyExpensesForm movements={movements} onSuccess={handleClose} />}
    </RightPanel>
  )
}

VerifyExpensesDrawer.propTypes = {
  movements: PropTypes.array,
  open: PropTypes.bool,
  setOpen: PropTypes.func
}

export default VerifyExpensesDrawer
