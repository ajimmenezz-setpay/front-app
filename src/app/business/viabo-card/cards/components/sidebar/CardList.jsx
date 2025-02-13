import PropTypes from 'prop-types'

import { List } from '@mui/material'

import CardItem from '@/app/business/viabo-card/cards/components/sidebar/CardItem'
import SkeletonCardItem from '@/app/business/viabo-card/cards/components/sidebar/SkeletonCardItem'

CardList.propTypes = {
  cards: PropTypes.array,
  isOpenSidebar: PropTypes.bool,
  onOpenDetails: PropTypes.func,
  isLoading: PropTypes.bool,
  sx: PropTypes.object
}

export function CardList({ cards, isOpenSidebar, isLoading, sx, onOpenDetails, ...other }) {
  return (
    <List disablePadding sx={sx} {...other}>
      {(isLoading ? [...Array(5)] : cards).map((card, index) =>
        card?.id ? (
          <CardItem key={card?.id} isOpenSidebar={isOpenSidebar} card={card} onOpenDetails={onOpenDetails} />
        ) : (
          <SkeletonCardItem isOpenSideBar={isOpenSidebar} key={index} />
        )
      )}
    </List>
  )
}
