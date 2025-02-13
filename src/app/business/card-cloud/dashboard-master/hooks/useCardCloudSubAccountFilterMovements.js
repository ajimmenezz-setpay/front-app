import { useEffect, useMemo, useState } from 'react'

import { endOfDay, startOfDay, sub } from 'date-fns'

import { useFindCardCloudSubAccountMovements } from './useFindCardCloudSubAccountMovements'

import { useCardCloudSharedStore } from '../../shared/store'
import { useCardCloudDashboardStore } from '../store'

import { fTimestampUTC } from '@/shared/utils'

export const useCardCloudSubAccountFilterMovements = (subAccountId, options = {}) => {
  const setFilter = useCardCloudDashboardStore(state => state.setFilterMovements)
  const filterDate = useCardCloudDashboardStore(state => state.filterMovements)
  const selectedCompany = useCardCloudSharedStore(state => state.selectedCompany)

  const currentDate = new Date()

  const initialStartDate = useMemo(
    () => (filterDate?.startDate ? new Date(filterDate?.startDate) : sub(currentDate, { days: 30 })),
    [filterDate?.startDate]
  )

  const initialEndDate = useMemo(
    () => (filterDate?.endDate ? new Date(filterDate?.endDate) : currentDate),
    [filterDate?.endDate]
  )

  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)

  const queryMovements = useFindCardCloudSubAccountMovements(
    { fromDate: fTimestampUTC(startOfDay(startDate)), toDate: fTimestampUTC(endOfDay(endDate)) },
    selectedCompany?.subAccountId,
    {
      enabled: !!selectedCompany?.subAccountId
    }
  )

  useEffect(() => {
    if (startDate && endDate) {
      queryMovements.refetch()
      setFilter({ startDate, endDate })
    }
  }, [startDate, endDate])

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    queryMovements,
    selectedCompany
  }
}
