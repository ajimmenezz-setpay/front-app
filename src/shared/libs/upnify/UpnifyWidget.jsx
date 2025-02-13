import { useEffect } from 'react'

import { loadUpnifyScript } from './upnify'

const UpnifyWidget = () => {
  useEffect(() => {
    loadUpnifyScript()
  }, []) // Se ejecuta solo una vez al montar el componente

  return null
}

export default UpnifyWidget
