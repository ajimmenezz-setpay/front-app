import { useMutation, useQueryClient } from '@tanstack/react-query'

import { COMMERCE_KEYS } from '@/app/business/commerce/adapters'
import { deleteDocuments } from '@/app/business/commerce/services'

export const useDeleteDocuments = (options = {}) => {
  const client = useQueryClient()
  const mutation = useMutation({
    mutationFn: deleteDocuments,
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: [COMMERCE_KEYS.COMMERCE_PROCESS]
      })
    },
    ...options
  })

  return {
    ...mutation,
    isLoading: mutation.isPending
  }
}
