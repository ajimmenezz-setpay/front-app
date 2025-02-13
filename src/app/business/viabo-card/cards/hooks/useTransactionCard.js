import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { CARDS_COMMERCES_KEYS } from '@/app/business/viabo-card/cards/adapters'
import { transactionsCard } from '@/app/business/viabo-card/cards/services'
import { getErrorAPI, getNotificationTypeByErrorCode } from '@/shared/interceptors'

export const useTransactionCard = (options = {}) => {
  const client = useQueryClient()

  const transactionMutate = useMutation({
    mutationFn: transactionsCard,
    ...options
  })
  const transaction = async (formData, options) => {
    const { onSuccess, onError, mutationOptions } = options

    try {
      await toast.promise(transactionMutate.mutateAsync(formData, mutationOptions), {
        pending: 'Procesando Transferencia ...',
        success: {
          render({ data: transactions }) {
            client.fetchQuery({ queryKey: [CARDS_COMMERCES_KEYS.TRANSIT_BALANCE] })
            client.invalidateQueries({
              queryKey: [CARDS_COMMERCES_KEYS.CARD_INFO, transactions?.cardId]
            })
            client.fetchQuery({ queryKey: [CARDS_COMMERCES_KEYS.CARD_MOVEMENTS, transactions?.cardId] })
            client.fetchQuery({ queryKey: [CARDS_COMMERCES_KEYS.MAIN_CARD] })
            onSuccess(transactions)
            return 'Se realizo la transferencia con éxito'
          }
        }
      })
    } catch (error) {
      const errorFormatted = getErrorAPI(
        error,
        `No se puede realizar esta operación en este momento. Intente nuevamente o reporte a sistemas`
      )
      onError(errorFormatted)
      toast.error(errorFormatted, {
        type: getNotificationTypeByErrorCode(error)
      })
    }
  }

  return {
    ...transactionMutate,
    transaction,
    isLoading: transactionMutate.isPending
  }
}
