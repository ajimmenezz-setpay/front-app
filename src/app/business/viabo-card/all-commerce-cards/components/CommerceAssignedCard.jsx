import PropTypes from 'prop-types'

import { Checkbox, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'

import { useCommerceCards } from '@/app/business/viabo-card/all-commerce-cards/store'
import { CardCVV, CardNumber, CardStyled } from '@/app/shared/components/card'

export default function CommerceAssignedCard({ card }) {
  const setSelectedCard = useCommerceCards(state => state.setSelectedCard)
  const cardsSelected = useCommerceCards(state => state.cards)

  const isSelected = cardsSelected?.some(cardSelected => cardSelected?.id === card?.id)

  const handleSelectCard = e => {
    e.stopPropagation()
    setSelectedCard(card)
  }

  return (
    <motion.div onClick={handleSelectCard} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.8 }}>
      <CardStyled sx={{ m: 1, cursor: 'pointer' }}>
        <Stack flexDirection={'row'} gap={1}>
          <Checkbox
            onClick={handleSelectCard}
            edge="start"
            checked={isSelected}
            inputProps={{ 'aria-labelledby': card?.id }}
            color={'success'}
          />
          <Stack>
            <Typography variant={'subtitle2'} sx={{ opacity: 0.72 }}>
              {card?.assignUser?.fullName === '-' ? 'Viabo Card' : card?.assignUser?.fullName}
            </Typography>
            <Typography variant={'caption'} color={'text.secondary'}>
              {card?.register}
            </Typography>
          </Stack>
        </Stack>

        <CardNumber card={card} disableShow />

        <Stack direction="row" spacing={5}>
          <Stack>
            <Typography sx={{ mb: 1, typography: 'caption', opacity: 0.48 }}>Vencimiento</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>{card?.expiration}</Typography>
          </Stack>
          <CardCVV card={card} disableShow />
        </Stack>
      </CardStyled>
    </motion.div>
  )
}

CommerceAssignedCard.propTypes = {
  card: PropTypes.shape({
    expiration: PropTypes.any,
    id: PropTypes.any,
    register: PropTypes.any
  })
}
