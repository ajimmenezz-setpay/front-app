import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARD_CLOUD_SHARED_KEYS } from '../adapters'
import { getCardHoldersByCompany } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindCardHoldersByCompany = (companyId, options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [CARD_CLOUD_SHARED_KEYS.CARD_HOLDERS, companyId],
    queryFn: ({ signal }) => getCardHoldersByCompany(companyId),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 300000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener los tarjetahabientes de la empresa. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
      toast.error(errorMessage, {
        type: getNotificationTypeByErrorCode(query.error)
      })
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
