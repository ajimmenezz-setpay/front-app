import { useContext } from 'react'

import { SettingsContext } from '@theme/context'

export const useSettings = () => useContext(SettingsContext)
