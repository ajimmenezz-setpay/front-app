import { useState } from 'react'

import PropTypes from 'prop-types'

import { CreditCard, Receipt } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, Stack } from '@mui/material'

import FundingCommerceCardsDrawer from './FundingCommerceCardsDrawer'

import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { useCollapseDrawer } from '@/theme/hooks'

export function FundingGlobalCard({ isRefetchingCards, commerceCards, card }) {
  const { isCollapse } = useCollapseDrawer()

  const setOpenFundingOrder = useCommerceDetailsCard(state => state.setOpenFundingOrder)
  const setFundingCard = useCommerceDetailsCard(state => state.setFundingCard)

  const [openTransfer, setOpenTransfer] = useState(false)

  return (
    <>
      <Stack
        px={2}
        py={1}
        gap={1}
        flexDirection={{ lg: isCollapse ? 'row' : 'column', xl: 'row' }}
        justifyContent={'space-between'}
      >
        <Button
          color={'primary'}
          variant={'text'}
          startIcon={<Receipt />}
          size="small"
          onClick={() => {
            setOpenFundingOrder(true)
            setFundingCard(card)
          }}
        >
          Orden Fondeo
        </Button>

        <LoadingButton
          size="small"
          variant="text"
          color="primary"
          startIcon={<CreditCard />}
          loading={isRefetchingCards}
          onClick={() => {
            setOpenTransfer(true)
          }}
        >
          Fondear Tarjetas
        </LoadingButton>
      </Stack>
      <FundingCommerceCardsDrawer setOpen={setOpenTransfer} open={openTransfer} card={card} cardList={commerceCards} />
    </>
  )
}

FundingGlobalCard.propTypes = {
  card: PropTypes.any,
  commerceCards: PropTypes.any,
  isRefetchingCards: PropTypes.any
}
