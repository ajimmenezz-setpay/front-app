import { Suspense, lazy, useState } from 'react'

import { SupportAgent } from '@mui/icons-material'

import { TICKET_SUPPORT_PERMISSIONS } from '../../shared/permissions'

import { IconButtonAnimate } from '@/shared/components/animate'
import { useUser } from '@/shared/hooks'

const TicketSupportDrawer = lazy(() => import('../components/TicketSupportDrawer'))

export const TicketSupport = () => {
  const user = useUser()
  const hasCreateTicketPermission = user?.permissions.includes(TICKET_SUPPORT_PERMISSIONS.CREATE_TICKET)

  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  if (!hasCreateTicketPermission) {
    return null
  }

  return (
    <>
      <IconButtonAnimate color="primary" sx={{ width: 30, height: 30 }} onClick={handleClick}>
        <SupportAgent />
      </IconButtonAnimate>
      <Suspense fallback={<></>}>
        <TicketSupportDrawer open={open} setOpen={setOpen} />
      </Suspense>
    </>
  )
}
