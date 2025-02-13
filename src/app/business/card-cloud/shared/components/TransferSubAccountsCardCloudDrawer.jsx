import { lazy, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { m } from 'framer-motion'

import { CARD_CLOUD_CARDS_KEYS } from '../../cards/adapters'
import {
  CARD_CLOUD_SHARED_KEYS,
  CARD_CLOUD_TRANSFER_TYPES,
  CardCloudMovementsAdapter,
  CardCloudTransferAdapter
} from '../adapters'
import { useFindCardByCompanySubAccount, useGenerateTransactionOfCardCloud } from '../hooks'
import { useCardCloudSharedStore } from '../store'

import { RightPanel } from '@/app/shared/components'
import { varFade } from '@/shared/components/animate'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { fCurrency } from '@/shared/utils'

const TransferCardsOfCardCloud = Lodable(lazy(() => import('./TransferCardsOfCardCloud')))

const TransferSubAccountsCardCloudDrawer = () => {
  const openTransfer = useCardCloudSharedStore(state => state.openTransfer)
  const selectedCompany = useCardCloudSharedStore(state => state.selectedCompany)
  const companySubAccountInfo = useCardCloudSharedStore(state => state.companySubAccountInfo)
  const setOpenTransfer = useCardCloudSharedStore(state => state.setOpenTransfer)

  const { isLoading, isError, error, refetch, data } = useFindCardByCompanySubAccount(selectedCompany?.subAccountId, {
    enabled: !!(selectedCompany?.subAccountId && openTransfer)
  })

  const { mutate, isLoading: isSendingTransaction } = useGenerateTransactionOfCardCloud()
  const client = useQueryClient()

  const [view, setView] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(null)

  const handleClose = () => {
    setOpenTransfer(false)
  }

  const titleTransaction = (
    <Stack>
      <Typography variant="h6">Transferir a Tarjetas</Typography>
      <Typography variant="caption">Subcuenta: {companySubAccountInfo?.description}</Typography>
      <Typography variant="subtitle1">{companySubAccountInfo?.wallet?.balance?.format}</Typography>
    </Stack>
  )

  const handleSubmit = values => {
    setIsSubmitting(true)
    const transfer = {
      originType: CARD_CLOUD_TRANSFER_TYPES.SUBACCOUNT,
      origin: companySubAccountInfo?.subAccountId,
      destinationType: CARD_CLOUD_TRANSFER_TYPES.CARD,
      destination: values?.card?.id,
      amount: parseFloat(values.amount.trim().replace(/,/g, '')),
      concept: values.concept
    }
    const transaction = CardCloudTransferAdapter(transfer)

    mutate(transaction, {
      onSuccess: data => {
        if (data?.new_balance) {
          const balance = parseFloat(data?.new_balance ? data?.new_balance : 0) ?? 0
          client.invalidateQueries({ queryKey: [CARD_CLOUD_CARDS_KEYS.CARD, values?.card?.id] })
          client.invalidateQueries({ queryKey: [CARD_CLOUD_CARDS_KEYS.CARD_MOVEMENTS, values?.card?.id] })
          client.invalidateQueries({ queryKey: [CARD_CLOUD_SHARED_KEYS.CARDS, selectedCompany?.subAccountId] })
          client.setQueryData(
            [CARD_CLOUD_SHARED_KEYS.SUBACCOUNT_INFO, companySubAccountInfo?.subAccountId],
            oldData => {
              const movements = oldData?.wallet?.lastMovements?.original || []
              const newMovements = [...movements, data?.movement]
              const wallet = {
                ...oldData?.wallet,
                balance: {
                  number: balance,
                  format: fCurrency(balance)
                },
                lastMovements: CardCloudMovementsAdapter(newMovements)
              }
              return {
                ...oldData,
                wallet
              }
            }
          )
        }
        handleClose()
        setIsSubmitting(false)
      },
      onError: () => {
        setIsSubmitting(false)
      }
    })
  }

  const renderContentTransaction = (
    <>
      <TransferCardsOfCardCloud
        cards={data}
        balance={companySubAccountInfo?.wallet?.balance?.number}
        onSubmit={handleSubmit}
        isLoading={isSendingTransaction || isSubmitting}
      />
    </>
  )

  return (
    <RightPanel open={openTransfer} handleClose={handleClose} titleElement={titleTransaction}>
      {isLoading && <RequestLoadingComponent sx={{ p: 3 }} />}

      {isError && !isLoading && (
        <ErrorRequestPage
          sx={{ p: 3 }}
          errorMessage={error}
          titleMessage={'Lista de Tarjetas'}
          handleButton={() => refetch()}
        />
      )}

      {!isError && !isLoading && openTransfer && (
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

export default TransferSubAccountsCardCloudDrawer
