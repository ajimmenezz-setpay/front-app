import { useEffect, useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { WarningAmberOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Avatar, Link, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { MuiTelInput } from 'mui-tel-input'
import * as Yup from 'yup'

import { UpdateAssignedUserAdapter } from '../../adapters'
import { useRecoveryPasswordAssignedUser } from '../../hooks'
import { useUpdateUserInfo } from '../../hooks/useUpdateUserInfo'
import { useAssignUserCard } from '../../store'

import { FormProvider, RFTextField } from '@/shared/components/form'
import { ModalAlert } from '@/shared/components/modals'
import { Scrollbar } from '@/shared/components/scroll'
import { createAvatar } from '@/theme/utils'

const OPERATION_TYPES = {
  UPDATE_USER_INFO: '1',
  RECOVERY_PASSWORD: '2'
}

const CardUserInfoForm = ({ handleSuccess }) => {
  const cardInfo = useAssignUserCard(state => state.cardInfo)
  const { mutate, isLoading } = useUpdateUserInfo()
  const { mutate: recoveryPassword, isLoading: isRecoveringPassword } = useRecoveryPasswordAssignedUser()

  const [updatedName, setUpdatedName] = useState(cardInfo?.assignUser?.name || '')
  const [openAlertConfirm, setOpenAlertConfirm] = useState(false)
  const [operationType, setOperationType] = useState(null)

  const registerValidation = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    lastName: Yup.string(),
    phone: Yup.string().test(
      'longitud',
      'El teléfono es muy corto',
      value => !(value && value.replace(/[\s+]/g, '').length < 10)
    )
  })

  const formik = useFormik({
    initialValues: {
      name: cardInfo?.assignUser?.name || '',
      phone: cardInfo?.assignUser?.phone || '',
      lastName: cardInfo?.assignUser?.lastName || ''
    },
    enableReinitialize: true,
    validationSchema: registerValidation,
    onSubmit: (values, { setSubmitting }) => {
      if (operationType === OPERATION_TYPES.UPDATE_USER_INFO) {
        const data = UpdateAssignedUserAdapter(values, cardInfo)
        mutate(data, {
          onSuccess: () => {
            handleSuccess()
            setOperationType(null)
          }
        })
      }
      setSubmitting(false)
    }
  })

  const { values, setFieldValue, touched, errors, isSubmitting, handleSubmit } = formik

  const loading = isLoading || isSubmitting || isRecoveringPassword

  useEffect(() => {
    if (values.name) {
      setUpdatedName(values.name)
    } else {
      setUpdatedName(cardInfo?.assignUser?.name)
    }
  }, [values.name])

  const avatar = useMemo(() => createAvatar(updatedName), [updatedName])

  const handleSubmitRecoveryPassword = () => {
    recoveryPassword(cardInfo?.assignUser, {
      onSuccess: () => {
        handleSuccess()
        setOperationType(null)
      }
    })
  }

  const handleConfirmAlert = () => {
    setOpenAlertConfirm(false)
    if (operationType === OPERATION_TYPES.UPDATE_USER_INFO) {
      handleSubmit()
    }

    if (operationType === OPERATION_TYPES.RECOVERY_PASSWORD) {
      handleSubmitRecoveryPassword()
    }
  }

  return (
    <>
      <Scrollbar containerProps={{ sx: { flexGrow: 0, height: 'auto' } }}>
        <FormProvider formik={formik}>
          <Stack spacing={2} sx={{ p: 3 }}>
            <Stack spacing={0.5}>
              <Stack justifyContent={'center'} alignItems={'center'} spacing={1}>
                <Avatar
                  variant={'rounded'}
                  src={''}
                  color={'warning'}
                  alt={updatedName}
                  sx={{
                    backgroundColor: theme => theme.palette[avatar.color]?.main,
                    width: 80,
                    height: 80,
                    color: 'white'
                  }}
                >
                  {avatar.name}
                </Avatar>
                <Typography component={Link} href={`mailto:${cardInfo?.assignUser?.email}`} variant="body2">
                  {cardInfo?.assignUser?.email ?? '-'}
                </Typography>
                <Stack spacing={0.5} alignItems={'center'}>
                  {cardInfo?.assignUser?.lastLogged ? (
                    <>
                      <Typography paragraph variant="body2" fontStyle={'italic'} sx={{ color: 'text.disabled' }}>
                        Último Inicio de Sesión:
                      </Typography>

                      <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                        {cardInfo?.assignUser?.lastLogged ?? '🚀'}
                      </Typography>
                    </>
                  ) : (
                    <Typography paragraph variant="body2" fontStyle={'italic'} sx={{ color: 'text.disabled' }}>
                      No ha iniciado sesión 🚀
                    </Typography>
                  )}
                </Stack>
                <Stack>
                  <LoadingButton
                    variant="contained"
                    color="secondary"
                    loading={isRecoveringPassword}
                    disabled={loading}
                    sx={{ color: 'text.primary', fontWeight: 'bolder' }}
                    onClick={() => {
                      setOperationType(OPERATION_TYPES.RECOVERY_PASSWORD)
                      setOpenAlertConfirm(true)
                    }}
                  >
                    Restablecer Contraseña
                  </LoadingButton>
                </Stack>
              </Stack>
            </Stack>

            <Stack spacing={0.5}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Nombre (s)
              </Typography>
              <RFTextField name={'name'} required={true} placeholder={'Usuario'} disabled={loading} />
            </Stack>

            <Stack spacing={0.5}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Apellidos
              </Typography>
              <RFTextField name={'lastName'} required={true} placeholder={'Usuario'} disabled={loading} />
            </Stack>

            <Stack spacing={0.5}>
              <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                Teléfono
              </Typography>
              <MuiTelInput
                name="phone"
                fullWidth
                langOfCountryName="es"
                preferredCountries={['MX', 'US']}
                continents={['NA', 'SA']}
                value={values.phone || '+52'}
                disabled={loading}
                onChange={(value, info) => {
                  setFieldValue('phone', value)
                }}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
            </Stack>
            <Stack pt={2}>
              <LoadingButton
                size="large"
                variant="contained"
                color="primary"
                fullWidth
                loading={isLoading}
                disabled={loading}
                onClick={() => {
                  setOperationType(OPERATION_TYPES.UPDATE_USER_INFO)
                  setOpenAlertConfirm(true)
                }}
              >
                Actualizar
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </Scrollbar>
      {openAlertConfirm && (
        <ModalAlert
          title={operationType === OPERATION_TYPES.UPDATE_USER_INFO ? 'Actualizar Usuario' : 'Restablecer Contraseña'}
          typeAlert="warning"
          textButtonSuccess="Si, estoy de acuerdo"
          onClose={() => {
            setOpenAlertConfirm(false)
          }}
          open={openAlertConfirm}
          isSubmitting={false}
          description={
            <Stack spacing={2}>
              <Typography>
                {operationType === OPERATION_TYPES.UPDATE_USER_INFO
                  ? '¿Está seguro de actualizar la información de este usuario?'
                  : '¿Está seguro de restablecer la contraseña de este usuario?'}
              </Typography>
              {operationType === OPERATION_TYPES.RECOVERY_PASSWORD && (
                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                  <WarningAmberOutlined />
                  <Stack>
                    <Typography variant={'caption'}>
                      Se enviara una notificación via correo electrónico con los cambios realizados
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>
          }
          onSuccess={handleConfirmAlert}
          fullWidth
          maxWidth="xs"
        />
      )}
    </>
  )
}

CardUserInfoForm.propTypes = {
  handleSuccess: PropTypes.func
}

export default CardUserInfoForm
