import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { TWO_AUTH_KEYS } from '@/app/authentication/2FA/adapters'
import { getGoogleAuthQRCode } from '@/app/authentication/2FA/services'
import { getErrorAPI } from '@/shared/interceptors'

export const useFindGoogleAuthenticatorQR = (options = {}) => {
  const [customError, setCustomError] = useState(null)

  const query = useQuery({
    queryKey: [TWO_AUTH_KEYS.GOOGLE_AUTH_QR],
    queryFn: ({ signal }) => getGoogleAuthQRCode(),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 300000,
    ...options
  })

  useEffect(() => {
    if (query?.isError) {
      const errorMessage = getErrorAPI(
        query.error,
        'No se puede obtener el QR de Google Authenticator. Intente nuevamente o reporte a sistemas'
      )
      setCustomError(errorMessage)
    }
  }, [query.isError, query.error])

  return {
    ...query,
    error: customError || null
  }
}
