import { useQuery } from '@tanstack/react-query'

import { AUTHENTICATION_KEYS } from '../adapters'
import { getUserModules } from '../services'

export const UseFindModulesByUser = (options = {}) =>
  useQuery({
    queryKey: [AUTHENTICATION_KEYS.USER_MODULES],
    queryFn: getUserModules,
    retry: false,
    staleTime: 60 * 5000,
    ...options
  })
