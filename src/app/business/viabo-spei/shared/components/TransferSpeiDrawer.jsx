import { lazy, useMemo, useState } from 'react'

import { List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { m } from 'framer-motion'

import { STP_ACCOUNT_TYPES } from '../constants'

import { RightPanel } from '@/app/shared/components'
import { varFade } from '@/shared/components/animate'
import { Lodable } from '@/shared/components/lodables'
import { TwoAuthDisabled } from '@/shared/components/notifications'
import LocationDisabled from '@/shared/components/notifications/LocationDisabled'
import { useUser } from '@/shared/hooks'
import { useUiSharedStore } from '@/shared/store'

const TransferSpeiForm = Lodable(lazy(() => import('./TransferSpeiForm')))
const SpeiOutResume = Lodable(lazy(() => import('./SpeiOutResume')))
const SpeiOutSuccess = Lodable(lazy(() => import('./SpeiOutSuccess')))

const TransferSpeiDrawer = ({ open, setOpen, selectedAccounts, setSelectedAccounts, originAccount, isCompanies }) => {
  const { twoAuth } = useUser()
  const { isEnableLocation, validateGeoLocationPermission } = useUiSharedStore()

  const [currentBalance, setCurrentBalance] = useState(0)
  const [transactionForm, setTransactionForm] = useState(null)
  const balance = useMemo(() => originAccount?.balance?.number, [originAccount?.balance])
  const [showResume, setShowResume] = useState(false)
  const [transactionData, setTransactionData] = useState(null)
  const [successTransaction, setSuccessTransaction] = useState(null)
  const [transactionLoading, setTransactionLoading] = useState(false)

  const thirdAccountsAdaptedToTransactions = useMemo(
    () =>
      selectedAccounts?.map(account => ({
        id: account?.id,
        account,
        amount: ''
      })),
    [selectedAccounts]
  )

  const handleClose = () => {
    setOpen(false)
    setSelectedAccounts([])
    setTransactionForm(null)
    setShowResume(false)
    setSuccessTransaction(null)
  }

  const handleBackResume = () => {
    setShowResume(false)
  }

  const handleSuccess = transaction => {
    setShowResume(false)
    setSuccessTransaction(transaction)
  }

  const handleSuccessForm = values => {
    let commissions = {
      speiOut: 0,
      internalTransferCompany: 0,
      fee: 0
    }
    let totalAmountCommissions = 0

    setTransactionForm(values)

    const notAdminSTPConcentrators = originAccount?.type !== STP_ACCOUNT_TYPES.CONCENTRATOR

    if (!isCompanies && notAdminSTPConcentrators) {
      const percentageSpeiOut = originAccount?.commissions?.speiOut || 0
      const amountFee = originAccount?.commissions?.fee || 0
      const commissionFee = values?.transactions?.length * amountFee
      const commissionSpeiOut =
        values?.transactions?.reduce((totalCommission, transaction) => {
          const amount = parseFloat(transaction.amount.replace(/,/g, ''))
          totalCommission += amount * (percentageSpeiOut / 100)

          return totalCommission
        }, 0) || 0

      totalAmountCommissions = (commissionFee + commissionSpeiOut).toFixed(2)

      commissions = {
        speiOut: commissionSpeiOut.toFixed(2),
        internalTransferCompany: 0,
        fee: commissionFee.toFixed(2)
      }
    }

    if (isCompanies && notAdminSTPConcentrators) {
      const percentageInternalCompany = originAccount?.commissions?.internalTransferCompany || 0
      const internalCommissionCompany =
        values?.transactions?.reduce((totalCommission, transaction) => {
          const amount = parseFloat(transaction.amount.replace(/,/g, ''))
          totalCommission += amount * (percentageInternalCompany / 100)
          return totalCommission
        }, 0) || 0

      totalAmountCommissions = internalCommissionCompany.toFixed(2)

      commissions = {
        speiOut: 0,
        internalTransferCompany: internalCommissionCompany.toFixed(2),
        fee: 0
      }
    }

    const currentBalanceWithCommissions = (parseFloat(balance) - currentBalance - totalAmountCommissions).toFixed(2)

    const insufficient = Boolean(currentBalanceWithCommissions < 0)

    setTransactionData({
      transactions: values?.transactions || [],
      concept: values?.concept,
      balance,
      origin: values?.origin,
      internal: !!isCompanies,
      currentBalance,
      commissions,
      insufficient,
      total: currentBalanceWithCommissions
    })

    setShowResume(true)
  }

  if (!twoAuth) {
    return (
      <RightPanel open={open} handleClose={handleClose} titleElement={'Transferir SPEI'}>
        <Stack p={3}>
          <TwoAuthDisabled
            titleMessage={'Google Authenticator'}
            errorMessage={
              'Para realizar esta operación debe activar y configurar el Doble Factor de Autentificación (2FA) desde su perfil.'
            }
          />
        </Stack>
      </RightPanel>
    )
  }

  if (!isEnableLocation) {
    return (
      <RightPanel open={open} handleClose={handleClose} titleElement={'Transferir SPEI'}>
        <Stack p={3}>
          <LocationDisabled
            titleMessage={'Ubicación'}
            errorMessage={'Para realizar esta operación debe activar la localización de su dispositivo'}
            handleClick={() => validateGeoLocationPermission(true)}
          />
        </Stack>
      </RightPanel>
    )
  }

  return (
    <RightPanel
      open={open}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>Transferir SPEI</Typography>
          <List dense={true} disablePadding>
            <ListItem sx={{ px: 0 }}>
              <ListItemText
                sx={{ typography: 'caption', textWrap: 'pretty' }}
                primary={
                  'Operación de transferencias spei out en horarios de Lunes a Viernes o último día hábil hasta las 17:59:59.'
                }
                secondary={'Después de ese horario se reflejará al siguiente día hábil.'}
              />
            </ListItem>
          </List>
        </Stack>
      }
    >
      {open && !showResume && !successTransaction && (
        <m.div
          variants={varFade().in}
          style={{
            display: showResume ? 'none' : 'flex',
            flex: 1,
            overflow: 'hidden',
            flexDirection: 'column'
          }}
        >
          <TransferSpeiForm
            setCurrentBalance={setCurrentBalance}
            stateValues={transactionForm}
            originAccount={originAccount}
            onSuccess={handleSuccessForm}
            initialAccounts={thirdAccountsAdaptedToTransactions}
          />
        </m.div>
      )}

      {open && showResume && !successTransaction && (
        <m.div variants={varFade().in}>
          <SpeiOutResume
            data={transactionData}
            onBack={handleBackResume}
            setTransactionLoading={setTransactionLoading}
            transactionLoading={transactionLoading}
            onSuccess={handleSuccess}
          />
        </m.div>
      )}

      {open && !showResume && successTransaction && (
        <m.div variants={varFade().in}>
          <SpeiOutSuccess transactions={successTransaction} onFinish={handleClose} />
        </m.div>
      )}
    </RightPanel>
  )
}

export default TransferSpeiDrawer
