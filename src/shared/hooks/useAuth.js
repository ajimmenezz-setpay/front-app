import { useContext } from 'react'

import { AuthContext } from '@/shared/contexts'

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) throw new Error('Auth context must be use inside AuthProvider')

  return context
}
