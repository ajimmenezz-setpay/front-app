import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { endOfDay, format, startOfDay } from 'date-fns'
import { toast } from 'react-toastify'

import { VIABO_SPEI_SHARED_KEYS } from '../adapters'
import { getBalanceResumeViaboSpei } from '../services'

import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useFindSpeiBalanceResume = (startDate, endDate, account, options = {}) => {
  const initialDate = format(startOfDay(startDate), 'yyyy-MM-dd')
  const finalDate = format(endOfDay(endDate), 'yyyy-MM-dd')

  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [VIABO_SPEI_SHARED_KEYS.BALANCE_RESUME],
    queryFn: ({ signal }) => getBalanceResumeViaboSpei({ initialDate, endDate: finalDate, account }),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 300000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener el resumen del balance de la cuenta stp. Intente nuevamente o reporte a sistemas'
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
