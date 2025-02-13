import { lazy } from 'react'

import { Stack, Typography } from '@mui/material'

import { useCommerce } from '../store'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'
import { Scrollbar } from '@/shared/components/scroll'

const ServicesForm = Lodable(lazy(() => import('./details/ServicesForm')))

const CommerceServices = () => {
  const { setCommerce, setOpenCommerceServices } = useCommerce(state => state)
  const openCommerceServices = useCommerce(state => state.openCommerceServices)
  const commerce = useCommerce(state => state.commerce)

  const handleClose = () => {
    setOpenCommerceServices(false)
    setCommerce(null)
  }

  return (
    <RightPanel
      open={openCommerceServices}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>Servicios del Comercio</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        {openCommerceServices && <ServicesForm commerce={commerce} onSuccess={handleClose} />}
      </Scrollbar>
    </RightPanel>
  )
}

export default CommerceServices
