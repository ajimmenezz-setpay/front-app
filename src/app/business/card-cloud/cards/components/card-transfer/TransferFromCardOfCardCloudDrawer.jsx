import { useEffect, useMemo, useState } from 'react'

import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { m } from 'framer-motion'

import TransferToSubAccountForm from './TransferToSubAccountForm'

import {
  CARD_CLOUD_TRANSFER_TYPES,
  CardCloudMovementsAdapter,
  CardCloudTransferAdapter
} from '../../../shared/adapters'
import TransferCardsOfCardCloud from '../../../shared/components/TransferCardsOfCardCloud'
import { useGenerateTransactionOfCardCloud } from '../../../shared/hooks'
import { useCardCloudSharedStore } from '../../../shared/store'
import { CARD_CLOUD_CARDS_KEYS } from '../../adapters'
import { useCardsOfCardCloudStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { varFade } from '@/shared/components/animate'
import { fCurrency, isFunction } from '@/shared/utils'

const TransferFromCardOfCardCloudDrawer = ({ onSuccess }) => {
  const openTransfer = useCardsOfCardCloudStore(state => state.openTransfer)
  const selectedCard = useCardsOfCardCloudStore(state => state.selectedCard)
  const selectedCompany = useCardCloudSharedStore(state => state.selectedCompany)
  const cards = useCardsOfCardCloudStore(state => state.cards)
  const setOpenTransfer = useCardsOfCardCloudStore(state => state.setOpenTransfer)
  const filterKeyMovements = useCardsOfCardCloudStore(state => state.filterKeyMovements)

  const filterCards = useMemo(() => cards?.filter(card => card?.id !== selectedCard?.id), [cards, selectedCard])

  const { mutate, isLoading: isSendingTransaction } = useGenerateTransactionOfCardCloud()
  const client = useQueryClient()

  const [view, setView] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(null)

  const handleClose = () => {
    setOpenTransfer(false)
  }

  const handleChangeView = (event, newValue) => {
    if (newValue) {
      setView(newValue)
    }
  }

  useEffect(() => {
    if (filterCards?.length > 0) {
      setView('cards')
    } else {
      setView('subaccount')
    }
  }, [filterCards])

  const titleTransaction = (
    <Typography variant="h6">{view === 'cards' ? 'Transferir a Tarjetas' : 'Transferir a Subcuenta'}</Typography>
  )

  const handleSubmit = values => {
    setIsSubmitting(true)
    let transfer = {
      originType: CARD_CLOUD_TRANSFER_TYPES.CARD,
      origin: selectedCard?.id,
      destinationType: CARD_CLOUD_TRANSFER_TYPES.CARD,
      destination: values?.card?.id,
      amount: parseFloat(values.amount.trim().replace(/,/g, '')),
      concept: values.concept
    }
    if (view === 'subaccount') {
      transfer = {
        originType: CARD_CLOUD_TRANSFER_TYPES.CARD,
        origin: selectedCard?.id,
        destinationType: CARD_CLOUD_TRANSFER_TYPES.SUBACCOUNT,
        destination: selectedCompany?.subAccountId,
        amount: parseFloat(values.amount.trim().replace(/,/g, '')),
        concept: values.concept
      }
    }

    const transaction = CardCloudTransferAdapter(transfer)

    mutate(transaction, {
      onSuccess: data => {
        if (data?.new_balance) {
          const balance = parseFloat(data?.new_balance ? data?.new_balance : 0) ?? 0
          client.setQueryData([CARD_CLOUD_CARDS_KEYS.CARD, selectedCard?.id], oldData => ({
            ...oldData,
            balance: {
              number: balance,
              format: fCurrency(balance)
            }
          }))

          client.setQueryData([CARD_CLOUD_CARDS_KEYS.CARD_MOVEMENTS, selectedCard?.id, filterKeyMovements], oldData => {
            const movements = oldData?.original || []
            const newMovements = [...movements, data?.movement]
            const movementsAdapted = CardCloudMovementsAdapter(newMovements)

            return movementsAdapted
          })
        }
        handleClose()
        setIsSubmitting(false)
        isFunction(onSuccess) && onSuccess(data)
      },
      onError: () => {
        setIsSubmitting(false)
      }
    })
  }

  const loading = isSendingTransaction || isSubmitting

  const renderContentTransaction = (
    <>
      {filterCards?.length > 0 && (
        <Stack alignItems={'flex-end'} sx={{ py: 1, px: 3 }}>
          <ToggleButtonGroup
            size={'small'}
            color="primary"
            value={view}
            exclusive
            onChange={handleChangeView}
            aria-label="Platform"
            disabled={loading}
          >
            <ToggleButton value={'cards'}>Tarjetas</ToggleButton>
            <ToggleButton value={'subaccount'}>Subcuenta</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      )}
      {view === 'cards' && (
        <TransferCardsOfCardCloud
          isSubAccount={false}
          cards={filterCards}
          balance={selectedCard?.balance?.number ?? 0}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      )}
      {view === 'subaccount' && (
        <TransferToSubAccountForm
          balance={selectedCard?.balance?.number ?? 0}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      )}
    </>
  )

  return (
    <RightPanel open={openTransfer} handleClose={handleClose} titleElement={titleTransaction}>
      {openTransfer && (
        <m.div
          variants={varFade().in}
          style={{
            flex: 1,
            overflow: 'hidden',
            flexDirection: 'column'
          }}
        >
          {renderContentTransaction}
        </m.div>
      )}
    </RightPanel>
  )
}

export default TransferFromCardOfCardCloudDrawer
