import { useEffect, useRef } from 'react'

import { Alert } from '@mui/material'

export function AlertWithFocus({ children, listenElement, ...props }) {
  const alertRef = useRef(null)

  useEffect(() => {
    if (listenElement) {
      // Hacer scroll o enfocar en la alerta
      alertRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) // O focus()
    }
  }, [listenElement])

  return (
    <Alert ref={alertRef} {...props}>
      {children}
    </Alert>
  )
}
