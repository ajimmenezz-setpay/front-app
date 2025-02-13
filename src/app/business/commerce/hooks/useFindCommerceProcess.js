import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { COMMERCE_KEYS } from '@/app/business/commerce/adapters'
import { getCommerceProcess } from '@/app/business/commerce/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindCommerceProcess = (options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [COMMERCE_KEYS.COMMERCE_PROCESS],
    queryFn: getCommerceProcess,
    staleTime: 60 * 5000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener el proceso del comercio. Intente nuevamente o reporte a sistemas'
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
