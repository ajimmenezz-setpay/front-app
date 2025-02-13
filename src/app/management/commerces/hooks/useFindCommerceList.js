import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { toast } from 'react-toastify'

import { MANAGEMENT_COMMERCES_KEYS } from '@/app/management/commerces/adapters'
import { getCommerceList } from '@/app/management/commerces/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindCommerceList = (options = {}) => {
  const { enqueueSnackbar } = useSnackbar()
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [MANAGEMENT_COMMERCES_KEYS.COMMERCE_LIST],
    queryFn: getCommerceList,
    staleTime: 60 * 5000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de comercios. Intente nuevamente o reporte a sistemas'
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
