import React from 'react'

import PropTypes from 'prop-types'

import { List } from '@mui/material'

import CardItem from './CardItem'
import SkeletonCardItem from './SkeletonCardItem'

import { useCardsOfCardCloudStore } from '../../store'

import { EmptyList, ErrorRequestPage } from '@/shared/components/notifications'

export const CardsList = ({ cardsQuery, sx, ...other }) => {
  const { isLoading, data, error, isError, refetch } = cardsQuery

  const isOpenSidebar = useCardsOfCardCloudStore(state => state.isOpenSideBar)
  const isCollapse = useCardsOfCardCloudStore(state => state.isCollapse)
  const cards = useCardsOfCardCloudStore(state => state.filterCards)

  const isOpen = isOpenSidebar || !isCollapse

  if (isError && isOpen && !data && !isLoading) {
    return <ErrorRequestPage p={2.5} errorMessage={error} handleButton={refetch} />
  }

  if (data && isOpen && data?.length === 0 && !isLoading) {
    return <EmptyList p={2.5} message={'No hay tarjetas asignadas para este empresa'} />
  }

  return (
    <List disablePadding sx={sx} {...other}>
      {(isLoading ? [...Array(12)] : cards).map((card, index) =>
        card?.id ? (
          <CardItem key={card?.id} card={card} isOpen={!isCollapse} />
        ) : (
          <SkeletonCardItem isOpen={!isCollapse} key={index} />
        )
      )}
    </List>
  )
}

CardsList.propTypes = {
  cardsQuery: PropTypes.shape({
    data: PropTypes.array,
    error: PropTypes.any,
    isError: PropTypes.any,
    isLoading: PropTypes.any,
    refetch: PropTypes.any
  }),
  sx: PropTypes.any
}
