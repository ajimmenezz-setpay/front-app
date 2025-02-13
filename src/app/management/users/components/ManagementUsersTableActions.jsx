import { useState } from 'react'

import { Edit, PasswordTwoTone, WarningAmberOutlined } from '@mui/icons-material'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'

import { useToggleUserStatus } from '../hooks'
import { useManagementUsersStore } from '../store'

import { useResetPasswordUser } from '@/app/authentication/recovery-account/hooks'
import { IOSSwitch } from '@/shared/components/form'
import { CircularLoading } from '@/shared/components/loadings'
import { ModalAlert } from '@/shared/components/modals'

export const ManagementUsersTableActions = ({ table }) => {
  const { setOpenEditUser, setSelectedUser } = useManagementUsersStore()
  const [openAlertConfirm, setOpenAlertConfirm] = useState(false)
  const { row } = table
  const { original: rowData } = row
  const { status } = rowData

  const [idToggleStatus, setIdToggleStatus] = useState(null)
  const { mutate: changeUserStatus, isLoading: isChangingStatusCard } = useToggleUserStatus()
  const { mutate: recoverPassword, isLoading: isRecovering } = useResetPasswordUser()

  const handleChange = event => {
    changeUserStatus(
      { ...rowData, userId: rowData?.id, isActive: !status?.isActive, active: status?.isActive ? '0' : '1' },
      {
        onSuccess: () => {},
        onError: () => {}
      }
    )
  }

  const handleEditUser = () => {
    setSelectedUser(rowData)
    setOpenEditUser(true)
  }

  const isChangingStatus = isChangingStatusCard && idToggleStatus === rowData?.id

  const handleConfirmAlert = () => {
    recoverPassword(
      { userId: rowData?.id },
      {
        onSuccess: () => {
          setOpenAlertConfirm(false)
        },
        onError: () => {}
      }
    )
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: '8px'
        }}
      >
        {isChangingStatus ? (
          <CircularLoading
            size={15}
            containerProps={{
              display: 'flex'
            }}
          />
        ) : (
          <IOSSwitch
            size="sm"
            color={!status?.isActive ? 'error' : 'success'}
            checked={status?.isActive || false}
            inputProps={{ 'aria-label': 'controlled' }}
            onChange={e => {}}
            onClick={e => {
              e.stopPropagation()
              setIdToggleStatus(rowData?.id)
              handleChange()
            }}
          />
        )}

        {status?.isActive && (
          <Tooltip title="Editar Usuario">
            <IconButton size="small" color="primary" onClick={handleEditUser}>
              <Edit size="small" fontSize="16px" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Restablecer Contraseña">
          <IconButton size="small" onClick={() => setOpenAlertConfirm(true)}>
            <PasswordTwoTone size="small" fontSize="16px" />
          </IconButton>
        </Tooltip>
      </Box>
      <ModalAlert
        title={'¿Está seguro de restablecer la contraseña de este usuario?'}
        typeAlert="warning"
        textButtonSuccess="Si, estoy de acuerdo"
        onClose={() => {
          setOpenAlertConfirm(false)
        }}
        open={openAlertConfirm}
        isSubmitting={isRecovering}
        description={
          <Stack spacing={2}>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <WarningAmberOutlined />
              <Stack>
                <Typography variant={'caption'}>
                  Se enviara una notificación via correo electrónico al usuario con la nueva contraseña.
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        }
        onSuccess={handleConfirmAlert}
        fullWidth
        maxWidth="xs"
      />
    </>
  )
}
