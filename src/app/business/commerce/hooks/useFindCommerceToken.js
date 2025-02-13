import { useEffect, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { COMMERCE_KEYS } from '@/app/business/commerce/adapters'
import { getCommerceToken } from '@/app/business/commerce/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindCommerceToken = (email, options = {}) => {
  const client = useQueryClient()

  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [COMMERCE_KEYS.TOKEN_COMMERCE],
    queryFn: () => getCommerceToken(email),
    staleTime: 60 * 5000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener el comercio. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
      toast.error(errorMessage, {
        type: getNotificationTypeByErrorCode(query.error)
      })
    }
  }, [query.isError, query.error])

  useEffect(() => {
    if (query?.isSuccess) {
      client.removeQueries({ queryKey: [COMMERCE_KEYS.COMMERCE_PROCESS] })
    }
  }, [query.isSuccess])

  return {
    ...query,
    error: customError || null
  }
}
