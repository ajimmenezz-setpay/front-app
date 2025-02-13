import PropTypes from 'prop-types'

import { List } from '@mui/material'

import { TerminalItem } from './TerminalItem'

import { useTerminals } from '../../store'

import SkeletonCardItem from '@/app/business/viabo-card/cards/components/sidebar/SkeletonCardItem'
import { ErrorRequestPage } from '@/shared/components/notifications'
import EmptyList from '@/shared/components/notifications/EmptyList'

export const TerminalsList = ({ terminalsQuery, sx, ...other }) => {
  const { isLoading, data, error, isError, refetch } = terminalsQuery

  const isOpenSidebar = useTerminals(state => state.isOpenList)
  const terminals = useTerminals(state => state.terminals)

  if (isError && isOpenSidebar && !data && !isLoading) {
    return <ErrorRequestPage errorMessage={error} handleButton={refetch} />
  }

  if (data && isOpenSidebar && data?.length === 0 && !isLoading) {
    return <EmptyList pt={2.5} message={'No hay terminales activas para este comercio'} />
  }

  return (
    <List disablePadding sx={sx} {...other}>
      {(isLoading ? [...Array(12)] : terminals).map((terminal, index) =>
        terminal?.id ? (
          <TerminalItem key={terminal?.id} terminal={terminal} />
        ) : (
          <SkeletonCardItem isOpenSideBar={isOpenSidebar} key={index} />
        )
      )}
    </List>
  )
}

TerminalsList.propTypes = {
  sx: PropTypes.any,
  terminalsQuery: PropTypes.shape({
    data: PropTypes.array,
    error: PropTypes.any,
    isError: PropTypes.any,
    isLoading: PropTypes.any,
    refetch: PropTypes.any
  })
}
