import { useEffect, useMemo } from 'react'

import PropTypes from 'prop-types'

import { Box, Stack, Zoom } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import CommerceAssignedCard from '../CommerceAssignedCard'

import { CommerceCardsToolbar } from '@/app/business/viabo-card/all-commerce-cards/components/CommerceCardsToolbar'
import { useCommerceCards } from '@/app/business/viabo-card/all-commerce-cards/store'
import { CardsList } from '@/app/shared/components'
import { Scrollbar } from '@/shared/components/scroll'

export function CommerceCardsList({ commerceCards }) {
  const data = commerceCards?.data
  const cards = useCommerceCards(state => state.cards)
  const setIndexCards = useCommerceCards(state => state.setIndexCards)
  const theme = useTheme()

  const rowsSelected = useMemo(
    () => cards?.map(selected => data.findIndex(card => card.id === selected.id)) || [],
    [cards, data]
  )

  useEffect(() => {
    setIndexCards(rowsSelected)
  }, [rowsSelected])

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  }

  return (
    <Stack flexDirection={'row'} sx={{ height: '100vh', display: 'flex' }}>
      <Stack
        sx={theme => ({
          overflow: 'hidden',
          flexDirection: 'column',
          flexGrow: 1
        })}
      >
        <Zoom
          in={cards?.length > 0}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${cards?.length > 0 ? transitionDuration.exit : 0}ms`
          }}
          unmountOnExit
        >
          <Box>
            <CommerceCardsToolbar cards={commerceCards?.data} />
          </Box>
        </Zoom>

        <Scrollbar>
          <CardsList
            cards={commerceCards}
            emptyMessage={'No hay tarjetas sin asignar'}
            cardComponent={CommerceAssignedCard}
            my={3}
          />
        </Scrollbar>
      </Stack>
    </Stack>
  )
}

CommerceCardsList.propTypes = {
  commerceCards: PropTypes.shape({
    data: PropTypes.array
  })
}
