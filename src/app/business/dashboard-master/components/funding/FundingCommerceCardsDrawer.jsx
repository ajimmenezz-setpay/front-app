import { lazy, useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'
import { fCurrency } from '@/shared/utils'

const TransactionForm = Lodable(lazy(() => import('../../../viabo-card/cards/components/transfer/TransactionForm')))
const ResumeTransactionForm = Lodable(
  lazy(() => import('../../../viabo-card/cards/components/transfer/ResumeTransactionForm'))
)

const FundingCommerceCardsDrawer = ({ open, setOpen, card, cardList = [] }) => {
  const [currentBalance, setCurrentBalance] = useState(0)
  const balance = useMemo(() => card?.balance, [card?.balance])
  const [showResume, setShowResume] = useState(false)
  const [transactionData, setTransactionData] = useState(null)
  const [transactionLoading, setTransactionLoading] = useState(false)

  const insufficient = useMemo(
    () => Boolean((parseFloat(balance) - currentBalance).toFixed(2) < 0),
    [currentBalance, balance]
  )

  const handleClose = () => {
    setOpen(false)
    setCurrentBalance(0)
    setShowResume(false)
    setTransactionData(null)
    setTransactionLoading(false)
  }

  const handleSuccessForm = values => {
    const isGlobal = false
    const cardOriginId = card?.id

    setTransactionData({
      cardOriginId,
      paymentProcessor: card?.paymentProcessor,
      isGlobal,
      transactions: values?.transactions || [],
      concept: values?.concept,
      balance,
      currentBalance
    })
    setShowResume(true)
  }

  const handleBackResume = () => {
    setShowResume(false)
  }

  const titleTransaction = <Typography variant="h6"> Revisión - Fondeo Tarjetas</Typography>

  const renderContentTransaction = (
    <>
      <Stack flexDirection="column" alignItems={'center'} justifyContent={'space-between'} spacing={0} px={3} pt={2}>
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
      <TransactionForm
        cards={cardList}
        setCurrentBalance={setCurrentBalance}
        insufficient={insufficient}
        isBinCard={false}
        onSuccess={handleSuccessForm}
      />
    </>
  )

  return (
    <RightPanel open={open} handleClose={handleClose} titleElement={titleTransaction}>
      {open && (
        <>
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
        </>
      )}
    </RightPanel>
  )
}

FundingCommerceCardsDrawer.propTypes = {
  card: PropTypes.shape({
    balance: PropTypes.any,
    id: PropTypes.any,
    paymentProcessor: PropTypes.any
  }),
  cardList: PropTypes.array,
  open: PropTypes.any,
  setOpen: PropTypes.func
}

export default FundingCommerceCardsDrawer
