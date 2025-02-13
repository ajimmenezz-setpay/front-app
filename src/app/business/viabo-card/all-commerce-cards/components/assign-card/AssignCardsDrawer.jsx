import { lazy } from 'react'

import PropTypes from 'prop-types'

import { CreditCard } from '@mui/icons-material'
import { Chip, Stack } from '@mui/material'

import { useCommerceCards } from '@/app/business/viabo-card/all-commerce-cards/store'
import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'

const FormAssignCards = Lodable(lazy(() => import('./FormAssignCards')))

function AssignCardsDrawer({ open, handleClose, handleSuccess }) {
  const cardsSelected = useCommerceCards(state => state.cards)

  return (
    <RightPanel
      open={open}
      handleClose={handleClose}
      title={cardsSelected?.length === 1 ? 'Asociar Tarjeta' : 'Asociar Tarjetas'}
    >
      {open && (
        <>
          <Stack
            flexDirection={'row'}
            gap={2}
            flexWrap={'wrap'}
            justifyContent={'center'}
            alignItems={'center'}
            px={3}
            pt={3}
          >
            {cardsSelected?.map(card => (
              <Chip key={card?.id} icon={<CreditCard />} label={card?.cardNumberHidden} />
            ))}
          </Stack>
          <FormAssignCards cards={cardsSelected} onSuccess={handleSuccess} />
        </>
      )}
    </RightPanel>
  )
}

export default AssignCardsDrawer

AssignCardsDrawer.propTypes = {
  handleClose: PropTypes.func,
  handleSuccess: PropTypes.func,
  open: PropTypes.bool.isRequired
}
