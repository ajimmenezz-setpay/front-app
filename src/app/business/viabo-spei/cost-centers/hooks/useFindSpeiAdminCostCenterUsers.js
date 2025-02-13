import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { SPEI_COST_CENTERS_KEYS } from '../adapters'
import { getViaboSpeiAdminCostCenterUsers } from '../services'

import { getErrorAPI } from '@/shared/interceptors'

export const useFindSpeiAdminCostCenterUsers = (options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [SPEI_COST_CENTERS_KEYS.USERS_ADMIN_COST_CENTER_LIST],
    queryFn: ({ signal }) => getViaboSpeiAdminCostCenterUsers(),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 300000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener la lista de usuarios. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
