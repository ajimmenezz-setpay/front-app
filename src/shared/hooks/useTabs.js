import { useCallback, useMemo, useState } from 'react'

export function useTabs(defaultValues) {
  const [currentTab, setCurrentTab] = useState(defaultValues || '')

  const onChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue)
  }, [])

  const memoizedValue = useMemo(
    () => ({
      currentTab,
      setCurrentTab,
      onChangeTab
    }),
    [onChangeTab, currentTab]
  )

  return memoizedValue
}
