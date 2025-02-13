import { lazy, useEffect, useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { motion } from 'framer-motion'

import { CARDS_COMMERCES_KEYS } from '@/app/business/viabo-card/cards/adapters'
import { useCommerceDetailsCard } from '@/app/business/viabo-card/cards/store'
import { RightPanel } from '@/app/shared/components'
import { Label } from '@/shared/components/form'
import { Lodable } from '@/shared/components/lodables'
import { useGetQueryData, useUser } from '@/shared/hooks'
import { fCurrency } from '@/shared/utils'

const TransactionForm = Lodable(lazy(() => import('./TransactionForm')))
const ResumeTransactionForm = Lodable(lazy(() => import('./ResumeTransactionForm')))
const TransferToGlobalForm = Lodable(lazy(() => import('./TransferToGlobalForm')))

export default function TransferSideBar({ open, setOpen, isFundingCard }) {
  const user = useUser()
  const card = useCommerceDetailsCard(state => state.card)
  const mainCard = useCommerceDetailsCard(state => state.mainCard)

  const cardList = useGetQueryData([CARDS_COMMERCES_KEYS.CARDS_COMMERCE_LIST, card?.cardTypeId]) || []
  const [currentBalance, setCurrentBalance] = useState(0)
  const balance = useMemo(() => (isFundingCard ? mainCard?.balance : card?.balance), [mainCard?.balance, card?.balance])
  const [view, setView] = useState('1')
  const [showResume, setShowResume] = useState(false)
  const [transactionData, setTransactionData] = useState(null)
  const [transactionLoading, setTransactionLoading] = useState(false)

  const insufficient = useMemo(
    () => Boolean((parseFloat(balance) - currentBalance).toFixed(2) < 0),
    [currentBalance, balance]
  )
  const isLegalRepresentative = useMemo(() => user?.profile?.toLowerCase() === 'representante legal', [user])

  const filterCards = useMemo(
    () => cardList?.filter(commerceCard => commerceCard.id !== card?.id),
    [cardList, card?.id]
  )

  const handleClose = () => {
    setOpen(false)
    setCurrentBalance(0)
    setShowResume(false)
    setTransactionData(null)
    setTransactionLoading(false)
  }

  const handleChangeView = (event, newValue) => {
    if (newValue) {
      setView(newValue)
    }
  }

  useEffect(() => {
    setCurrentBalance(0)
  }, [view])

  const handleSuccessForm = values => {
    const isGlobal = view === '2'
    let cardOriginId = isFundingCard ? mainCard?.id : card?.id
    isGlobal && (cardOriginId = card?.id)

    setTransactionData({
      cardOriginId,
      isGlobal,
      transactions: isGlobal ? values : values?.transactions || [],
      concept: values?.concept,
      balance,
      currentBalance
    })
    setShowResume(true)
  }

  const handleBackResume = () => {
    setShowResume(false)
  }

  const titleTransaction = (
    <>
      {isFundingCard ? (
        <Typography variant="h6">Fondear</Typography>
      ) : (
        <Box>
          <Stack spacing={1} alignItems={'center'} direction={'row'} mb={0.5}>
            <Typography variant="subtitle2">Origen: </Typography>
            <Typography variant="subtitle2">{card?.cardNumberMoreDigits} </Typography>
          </Stack>
          <Label color={'info'}>{card?.assignUser?.name}</Label>
        </Box>
      )}
    </>
  )

  const renderContentTransaction = (
    <>
      {!isFundingCard && isLegalRepresentative && (
        <Stack alignItems={'flex-end'} sx={{ py: 1, px: 3 }}>
          <ToggleButtonGroup
            size={'small'}
            color="primary"
            value={view}
            exclusive
            onChange={handleChangeView}
            aria-label="Platform"
            disabled={transactionLoading}
          >
            <ToggleButton value="1">Tarjetas</ToggleButton>
            <ToggleButton value="2">Global</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      )}

      <Stack
        flexDirection="column"
        alignItems={'center'}
        justifyContent={'space-between'}
        spacing={0}
        px={3}
        pt={isFundingCard ? 2 : 1}
      >
        <Typography variant="subtitle1">Saldo</Typography>
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <Typography variant="h3" color={'success.main'}>
            {fCurrency(balance)}
          </Typography>
          <Typography variant="caption" color={'success.main'}>
            MXN
          </Typography>
        </Stack>
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <Typography variant="subtitle1" color={'error'}>
            - {fCurrency(currentBalance)}
          </Typography>
          <Typography variant="caption" color={'error'}>
            MXN
          </Typography>
        </Stack>
        {insufficient && (
          <Typography variant="caption" color={'warning.main'} textAlign={'center'}>
            Saldo insuficiente para realizar la(s) operacion(es)
          </Typography>
        )}
      </Stack>

      {isFundingCard && (
        <TransactionForm
          cards={isFundingCard ? cardList : filterCards}
          setCurrentBalance={setCurrentBalance}
          insufficient={insufficient}
          isBinCard={isFundingCard}
          onSuccess={handleSuccessForm}
        />
      )}

      {!isFundingCard && isLegalRepresentative && (
        <>
          {view === '1' && (
            <TransactionForm
              cards={isFundingCard ? cardList : filterCards}
              setCurrentBalance={setCurrentBalance}
              insufficient={insufficient}
              isBinCard={isFundingCard}
              onSuccess={handleSuccessForm}
            />
          )}
          {view === '2' && (
            <TransferToGlobalForm
              mainCard={mainCard}
              setCurrentBalance={setCurrentBalance}
              insufficient={insufficient}
              onSuccess={handleSuccessForm}
            />
          )}
        </>
      )}

      {!isFundingCard && !isLegalRepresentative && (
        <TransactionForm
          cards={isFundingCard ? cardList : filterCards}
          setCurrentBalance={setCurrentBalance}
          insufficient={insufficient}
          isBinCard={isFundingCard}
          onSuccess={handleSuccessForm}
        />
      )}
    </>
  )

  return (
    <RightPanel open={open} handleClose={handleClose} titleElement={titleTransaction}>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: showResume ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        style={{
          display: showResume ? 'none' : 'flex',
          flex: 1,
          overflow: 'hidden',
          flexDirection: 'column'
        }}
      >
        {renderContentTransaction}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showResume ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: showResume ? 'flex' : 'none',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden'
        }}
      >
        <ResumeTransactionForm
          data={transactionData}
          onBack={handleBackResume}
          setTransactionLoading={setTransactionLoading}
          transactionLoading={transactionLoading}
          onClose={handleClose}
        />
      </motion.div>
    </RightPanel>
  )
}

TransferSideBar.propTypes = {
  isFundingCard: PropTypes.bool,
  open: PropTypes.bool,
  setOpen: PropTypes.func
}
