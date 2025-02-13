import { useEffect } from 'react'

import { useExcelFileHandler } from '../../shared/hooks'
import { useFindCardByCompanySubAccount } from '../../shared/hooks/useFindCardsByCompanySubAccount'

export const useFundingCardsFromExcelFileOfCardCloud = subAccount => {
  const {
    isLoading,
    isError,
    error: errorCards,
    refetch,
    data: cards
  } = useFindCardByCompanySubAccount(subAccount?.subAccountId, {
    enabled: !!subAccount?.subAccountId
  })

  useEffect(() => {
    if (subAccount?.subAccountId) {
      refetch()
    }
  }, [subAccount])

  const columns = ['Client ID', 'Tarjeta', 'Tarjetahabiente', 'Monto', 'Concepto']

  const cardsAdaptedToFile = cards =>
    cards?.map(card => [card?.clientId, card?.number?.hidden, card?.userAssigned?.fullName, 0.0])

  const {
    downloadExcelFile,
    uploadExcelFile,
    loading: fileLoading,
    error: fileError,
    file,
    setFile
  } = useExcelFileHandler(columns, () => cardsAdaptedToFile(cards))

  const customErrorCards = isError ? { message: errorCards, severity: 'warning' } : null

  return {
    downloadFundingCardsLayoutExcel: () => downloadExcelFile('Plantilla_Fondeo_de_Tarjetas'),
    uploadFundingCardsLayoutExcel: uploadExcelFile,
    loading: isLoading || fileLoading,
    error: customErrorCards || fileError,
    file,
    setFile,
    cards,
    refetch
  }
}
