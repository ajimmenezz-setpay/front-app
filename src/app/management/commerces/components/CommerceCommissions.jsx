import { lazy } from 'react'

import { Stack, Typography } from '@mui/material'

import { useCommerce } from '../store'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'
import { Scrollbar } from '@/shared/components/scroll'

const CommissionsForm = Lodable(lazy(() => import('./details/CommissionsForm')))

const CommerceCommissions = () => {
  const { setCommerce, setOpenCommerceCommissions } = useCommerce(state => state)
  const openCommerceCommissions = useCommerce(state => state.openCommerceCommissions)
  const commerce = useCommerce(state => state.commerce)

  const handleClose = () => {
    setOpenCommerceCommissions(false)
    setCommerce(null)
  }

  return (
    <RightPanel
      open={openCommerceCommissions}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>Comisiones del Comercio</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        {openCommerceCommissions && <CommissionsForm commerce={commerce} onSuccess={handleClose} />}
      </Scrollbar>
    </RightPanel>
  )
}

export default CommerceCommissions
