import { lazy } from 'react'

import { Stack, Typography } from '@mui/material'

import { useManagementUsersStore } from '../../store'

import { RightPanel } from '@/app/shared/components'
import { Lodable } from '@/shared/components/lodables'
import { Scrollbar } from '@/shared/components/scroll'

const ManagementUserInfoForm = Lodable(lazy(() => import('./ManagementUserInfoForm')))

const ManagementUserDrawer = () => {
  const { setOpenEditUser, setSelectedUser } = useManagementUsersStore()
  const { selectedUser, openEditUser } = useManagementUsersStore()

  const handleClose = () => {
    setOpenEditUser(false)
    setSelectedUser(null)
  }

  const open = Boolean(openEditUser)

  return (
    <RightPanel
      open={open}
      handleClose={handleClose}
      titleElement={
        <Stack>
          <Typography variant={'h6'}>{'Editar Información del Usuario'}</Typography>
        </Stack>
      }
    >
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <Stack spacing={3} p={3}>
          {open && <ManagementUserInfoForm user={selectedUser} onSuccess={handleClose} />}
        </Stack>
      </Scrollbar>
    </RightPanel>
  )
}

export default ManagementUserDrawer
