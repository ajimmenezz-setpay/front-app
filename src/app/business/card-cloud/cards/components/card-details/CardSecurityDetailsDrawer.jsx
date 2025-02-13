import { lazy, memo, useEffect, useRef, useState } from 'react'

import { Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'

import { CARD_CLOUD_CARDS_KEYS } from '../../adapters'
import { useFindCardDynamicCVV, useFindCardSecurityDetails } from '../../hooks'
import { useCardsOfCardCloudStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { RequestLoadingComponent } from '@/shared/components/loadings'
import { Lodable } from '@/shared/components/lodables'
import { ErrorRequestPage } from '@/shared/components/notifications'
import { Scrollbar } from '@/shared/components/scroll'

const CardSecurityDetails = Lodable(lazy(() => import('./CardSecurityDetails')))

const CardSecurityDetailsDrawer = () => {
  const client = useQueryClient()
  const selectedCard = useCardsOfCardCloudStore(state => state.selectedCard)
  const openSecurityDetails = useCardsOfCardCloudStore(state => state.openSecurityDetails)
  const setOpenSecurityDetails = useCardsOfCardCloudStore(state => state.setOpenSecurityDetails)

  const {
    isLoading: loadingDetails,
    isError: isErrorDetails,
    error: errorDetails,
    refetch: refetchDetails,
    data
  } = useFindCardSecurityDetails(selectedCard?.id, {
    enabled: !!(selectedCard?.id && openSecurityDetails)
  })

  const {
    isLoading: loadingCVV,
    error: errorCVV,
    isError: isErrorCVV,
    data: dataCVV,
    refecth: refetchCVV
  } = useFindCardDynamicCVV(selectedCard?.id, {
    enabled: !!(selectedCard?.id && openSecurityDetails)
  })

  const handleClose = () => {
    setOpenSecurityDetails(false)

    if (selectedCard?.id) {
      client.removeQueries({ queryKey: [CARD_CLOUD_CARDS_KEYS.DYNAMIC_CVV, selectedCard?.id] })
    }
  }

  const [progress, setProgress] = useState(100)
  const [remainingTime, setRemainingTime] = useState(0) // in seconds
  const timer = useRef()

  useEffect(() => {
    if (!openSecurityDetails || !dataCVV?.expiration?.original) {
      clearInterval(timer?.current)
      setRemainingTime(0)
      setProgress(100)
    }

    if (openSecurityDetails && dataCVV?.expiration?.original) {
      const expirationTime = dataCVV?.expiration?.original
      const currentTime = Date.now()
      const timeRemaining = Math.floor((expirationTime - currentTime) / 1000)
      const initialTime = timeRemaining

      if (timeRemaining > 0) {
        setRemainingTime(timeRemaining)
        setProgress(100) // Start with full progress

        timer.current = setInterval(() => {
          setRemainingTime(prevTime => {
            const newTime = prevTime - 1
            if (newTime <= 0) {
              clearInterval(timer.current)
              handleClose()
              return 0
            }
            setProgress((newTime / initialTime) * 100)
            return newTime
          })
        }, 1000)
      }
    }

    return () => clearInterval(timer?.current)
  }, [openSecurityDetails, dataCVV])

  useEffect(() => {
    if (!openSecurityDetails) {
      setRemainingTime(0)
      setProgress(100)
      clearInterval(timer?.current)
    } else {
      refetchDetails()
    }
  }, [openSecurityDetails])

  const isLoading = loadingDetails || loadingCVV
  const isError = isErrorDetails || isErrorCVV
  const error = errorDetails || errorCVV

  return (
    <RightPanel
      open={Boolean(openSecurityDetails)}
      handleClose={handleClose}
      titleElement={
        <Typography variant="h6">
          Detalles de la Tarjeta {selectedCard?.type?.isPhysical ? 'Física' : 'Virtual'}
        </Typography>
      }
    >
      {isLoading && <RequestLoadingComponent sx={{ p: 4 }} />}

      {isError && !isLoading && (
        <ErrorRequestPage
          sx={{ p: 3 }}
          errorMessage={error}
          titleMessage={'Información de Tarjeta'}
          handleButton={() => {
            if (isErrorCVV) {
              refetchCVV()
            }
            if (isErrorDetails) {
              refetchDetails()
            }
          }}
        />
      )}
      {!isLoading && !isError && (
        <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
          <CardSecurityDetails
            progress={progress}
            remainingTime={remainingTime}
            card={selectedCard}
            dataCVV={dataCVV}
            securityInfo={data}
          />
        </Scrollbar>
      )}
    </RightPanel>
  )
}

export default memo(CardSecurityDetailsDrawer)
