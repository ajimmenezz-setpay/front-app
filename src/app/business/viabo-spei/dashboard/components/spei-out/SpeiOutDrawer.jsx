import { lazy, useEffect, useMemo, useState } from 'react'

import { FileDownloadTwoTone, FileUploadTwoTone } from '@mui/icons-material'
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { m } from 'framer-motion'
import { SiMicrosoftexcel } from 'react-icons/si'

import { STP_ACCOUNT_TYPES } from '../../../shared/constants'
import { useLoadSpeiOutTransactionsLayout } from '../../hooks'
import { useAdminDashboardSpeiStore } from '../../store'

import { SPEI_OUT_DESTINATION, getSpeiOutOptionByPermissions } from '@/app/business/viabo-spei/shared/constants'
import { useFindSpeiThirdAccountsList } from '@/app/business/viabo-spei/third-accounts/hooks'
import { RightPanel } from '@/app/shared/components'
import { varFade } from '@/shared/components/animate'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage, TwoAuthDisabled } from '@/shared/components/notifications'
import LocationDisabled from '@/shared/components/notifications/LocationDisabled'
import { useUser } from '@/shared/hooks'
import { useUiSharedStore } from '@/shared/store'

const SpeiOutForm = Lodable(lazy(() => import('./SpeiOutForm')))
const SpeiOutConcentratorForm = Lodable(lazy(() => import('./SpeiOutConcentratorForm')))
const SpeiOutResume = Lodable(lazy(() => import('../../../shared/components/SpeiOutResume')))
const SpeiOutSuccess = Lodable(lazy(() => import('../../../shared/components/SpeiOutSuccess')))

const SpeiOutDrawer = () => {
  const { twoAuth, permissions } = useUser()
  const { isEnableLocation, validateGeoLocationPermission } = useUiSharedStore()

  const [view, setView] = useState(null)

  const speiOutOptions = useMemo(() => getSpeiOutOptionByPermissions(permissions), [permissions])
  const defaultOption = useMemo(() => speiOutOptions?.find(option => option?.default), [speiOutOptions])

  const isCompaniesView = view === SPEI_OUT_DESTINATION.COMPANIES.id
  const isThirdAccountsView = view === SPEI_OUT_DESTINATION.THIRD_ACCOUNTS.id
  const isConcentratorView = view === SPEI_OUT_DESTINATION.CONCENTRATOR.id

  const { setOpenSpeiOut, openSpeiOut, selectedAccount } = useAdminDashboardSpeiStore()

  const [currentBalance, setCurrentBalance] = useState(0)
  const [transactionForm, setTransactionForm] = useState(null)
  const balance = useMemo(() => selectedAccount?.balance?.number, [selectedAccount?.balance])
  const [showResume, setShowResume] = useState(false)
  const [transactionData, setTransactionData] = useState(null)
  const [successTransaction, setSuccessTransaction] = useState(null)
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [accounts, setAccounts] = useState([])

  const {
    data: thirdAccountList,
    isLoading: isLoadingThirdAccountList,
    isError: isErrorThirdAccounts,
    error: errorThirdAccounts,
    refetch: refetchThirdAccounts
  } = useFindSpeiThirdAccountsList({ enabled: !!(openSpeiOut && twoAuth) })

  const {
    downloadTransactionsLayout,
    uploadTransactionsLayout,
    data: layoutTransactions,
    setData: setLayoutTransactions,
    accounts: accountsLayout,
    setAccounts: setAccountsLayout,
    loading: isUploadingFile
  } = useLoadSpeiOutTransactionsLayout()

  const companies = useAdminDashboardSpeiStore(state => state.companies)

  const titleTransaction = (
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
  )

  const isLoading = isLoadingThirdAccountList

  const isError = isErrorThirdAccounts
  const error = errorThirdAccounts

  const accountsCatalog = useMemo(() => {
    if (isCompaniesView) {
      return companies
    }
    if (isThirdAccountsView) {
      return thirdAccountList
    }
    return []
  }, [view, thirdAccountList, companies])

  const handleClose = () => {
    setOpenSpeiOut(false)
    setCurrentBalance(0)
    setShowResume(false)
    setTransactionData(null)
    setTransactionLoading(false)
    setTransactionForm(null)
    setSuccessTransaction(null)
    setAccountsLayout([])
    setLayoutTransactions(null)
  }

  const handleSuccessForm = values => {
    let commissions = {
      speiOut: 0,
      internalTransferCompany: 0,
      fee: 0
    }
    let totalAmountCommissions = 0

    setTransactionForm(values)

    const notAdminSTPConcentrators = selectedAccount?.type !== STP_ACCOUNT_TYPES.CONCENTRATOR

    if (isThirdAccountsView && notAdminSTPConcentrators) {
      const percentageSpeiOut = selectedAccount?.commissions?.speiOut || 0
      const amountFee = selectedAccount?.commissions?.fee || 0
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

    if (isCompaniesView && notAdminSTPConcentrators) {
      const percentageInternalCompany = selectedAccount?.commissions?.internalTransferCompany || 0
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
      internal: !isThirdAccountsView,
      currentBalance,
      commissions,
      insufficient,
      total: currentBalanceWithCommissions
    })

    setShowResume(true)
    setLayoutTransactions(null)
  }

  const handleBackResume = () => {
    setShowResume(false)
  }

  const handleSuccess = transaction => {
    setShowResume(false)
    setSuccessTransaction(transaction)
  }

  const handleChangeView = (event, newValue) => {
    if (newValue) {
      setView(newValue)
      setTransactionForm(null)
      setAccountsLayout([])
      setLayoutTransactions(null)
    }
  }

  const refetch = () => {
    refetchThirdAccounts()
  }

  useEffect(() => {
    setView(defaultOption?.id)
  }, [defaultOption])

  useEffect(() => {
    if (accountsLayout?.length > 0) {
      setAccounts(accountsLayout)
    } else if (accountsCatalog?.length > 0) {
      const newAccounts = structuredClone(accountsCatalog)
      setAccounts(newAccounts)
      setAccountsLayout(newAccounts)
    }
  }, [accountsCatalog, accountsLayout])

  const renderContentTransaction = (
    <>
      <Stack
        sx={{ pt: 2, px: 3 }}
        flexDirection={'row-reverse'}
        flexWrap={'wrap-reverse'}
        gap={2}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        {!isConcentratorView ? (
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <IconButton
              disabled={isUploadingFile}
              size="small"
              color="warning"
              title="Descargar Layout"
              sx={{
                borderRadius: 1,
                padding: 1,
                border: '1px solid'
              }}
              onClick={() => downloadTransactionsLayout(!!isCompaniesView)}
            >
              <SiMicrosoftexcel style={{ fontSize: 18, color: 'green' }} />
              <Box component={'span'}>
                <FileDownloadTwoTone fontSize="8px" />
              </Box>
            </IconButton>
            <IconButton
              disabled={isUploadingFile}
              size="small"
              color="primary"
              title="Cargar Layout"
              sx={{
                borderRadius: 1,
                padding: 1,
                border: '1px solid'
              }}
              onClick={() => uploadTransactionsLayout()}
            >
              <SiMicrosoftexcel style={{ fontSize: 18, color: 'green' }} />
              <Box component={'span'}>
                <FileUploadTwoTone fontSize="8px" />
              </Box>
            </IconButton>
          </Box>
        ) : (
          <Box display={'flex'} flex={1} />
        )}

        <Stack>
          <ToggleButtonGroup
            size={'small'}
            color="primary"
            value={view}
            exclusive
            onChange={handleChangeView}
            aria-label="Platform"
            disabled={transactionLoading}
          >
            {speiOutOptions?.map(option => (
              <ToggleButton key={option?.id} value={option?.id}>
                {option?.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Stack>

      {isConcentratorView ? (
        <SpeiOutConcentratorForm
          onSuccess={handleSuccessForm}
          setCurrentBalance={setCurrentBalance}
          initialValues={transactionForm}
          selectedAccount={selectedAccount}
        />
      ) : (
        <SpeiOutForm
          key={view}
          accounts={accounts || []}
          onSuccess={handleSuccessForm}
          setCurrentBalance={setCurrentBalance}
          initialValues={transactionForm}
          selectedAccount={selectedAccount}
          layoutTransactions={layoutTransactions}
        />
      )}
    </>
  )

  if (!twoAuth) {
    return (
      <RightPanel open={openSpeiOut} handleClose={handleClose} titleElement={titleTransaction}>
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
      <RightPanel open={openSpeiOut} handleClose={handleClose} titleElement={titleTransaction}>
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
    <RightPanel open={openSpeiOut} handleClose={handleClose} titleElement={titleTransaction}>
      {isLoading && <RequestLoadingComponent />}

      {isError && !isLoading && (
        <ErrorRequestPage errorMessage={error} titleMessage={'Lista de Cuentas'} handleButton={() => refetch()} />
      )}

      {!isError && !isLoading && openSpeiOut && !showResume && !successTransaction && (
        <m.div
          variants={varFade().in}
          style={{
            display: showResume ? 'none' : 'flex',
            flex: 1,
            overflow: 'hidden',
            flexDirection: 'column'
          }}
        >
          {renderContentTransaction}
        </m.div>
      )}

      {!isError && !isLoading && openSpeiOut && showResume && !successTransaction && (
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

      {!isError && !isLoading && openSpeiOut && !showResume && successTransaction && (
        <m.div variants={varFade().in}>
          <SpeiOutSuccess transactions={successTransaction} onFinish={handleClose} />
        </m.div>
      )}
    </RightPanel>
  )
}

export default SpeiOutDrawer
