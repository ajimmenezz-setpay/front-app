import PropTypes from 'prop-types'

import { Stack, Typography } from '@mui/material'

import { VirtualTerminalForm } from './VirtualTerminalForm'

import { useTerminalDetails } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { Scrollbar } from '@/shared/components/scroll'

const VirtualTerminalModal = ({ open, setOpen }) => {
  const terminal = useTerminalDetails(state => state.terminal)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <RightPanel
      open={open}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>Terminal Virtual</Typography>
          <Typography variant={'subtitle2'}>{terminal?.name}</Typography>
        </Stack>
      }
    >
      <Scrollbar>
        <VirtualTerminalForm onSuccessTransaction={handleClose} />
      </Scrollbar>
    </RightPanel>
  )
}

VirtualTerminalModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func
}

export default VirtualTerminalModal
