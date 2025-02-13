import { memo, useMemo } from 'react'

import PropTypes from 'prop-types'

import { Tab, Tabs } from '@mui/material'

import { Label } from '@/shared/components/form'

const TERMINAL_STATUS = [
  {
    name: 'Todos',
    id: 'all',
    color: 'primary'
  },
  {
    name: 'Aprobado',
    id: 'approved',
    color: 'success'
  },
  {
    name: 'Rechazado',
    id: 'rejected',
    color: 'error'
  }
]

const getTerminalStatusByName = statusName => TERMINAL_STATUS?.find(status => status.name === statusName)

const TerminalFilterStatus = ({ filterStatus, onChangeFilterStatus, filters }) => {
  const STATUS_OPTIONS = useMemo(() => TERMINAL_STATUS?.map(status => status.name), [])

  return (
    <Tabs
      allowScrollButtonsMobile
      variant="scrollable"
      scrollButtons="auto"
      value={filterStatus}
      onChange={onChangeFilterStatus}
      sx={{ px: 2 }}
    >
      {STATUS_OPTIONS.map(tab => {
        const status = getTerminalStatusByName(tab)
        const number = status ? filters?.status[status?.id] || 0 : 0

        return (
          <Tab
            icon={<Label color={status?.color}>{number}</Label>}
            iconPosition="end"
            disableRipple
            key={tab}
            label={tab}
            value={tab}
          />
        )
      })}
    </Tabs>
  )
}

export default memo(TerminalFilterStatus)

TerminalFilterStatus.propTypes = {
  filterStatus: PropTypes.any,
  filters: PropTypes.shape({
    status: PropTypes.any
  }),
  onChangeFilterStatus: PropTypes.func
}
