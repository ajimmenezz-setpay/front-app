import { Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { useCardUserAssign } from '@/app/business/viabo-card/register-cards/store'
import { PATH_AUTH } from '@/routes'
import { LogoSphere } from '@/shared/components/images'

export default function FormSuccessAssignCard() {
  const user = useCardUserAssign(state => state.user)
  const resetState = useCardUserAssign(state => state.resetState)

  return (
    <Stack sx={{ height: 1, p: 3 }} spacing={3}>
      <LogoSphere />
      <Stack direction="column" width={1} spacing={1}>
        <Typography variant="h4" color="textPrimary" align="center">
          Tu cuenta ha sido creada correctamente
        </Typography>
        <Typography variant="h4" color="textPrimary" align="center">
          ¡Bienvenido!
        </Typography>
        <Typography paragraph align="center" variant="body1" color={'text.secondary'} whiteSpace="pre-line">
          Enviamos un correo electrónico a {user?.email || '-'} con los datos de acceso de tu cuenta.
        </Typography>
      </Stack>
      <Stack px={5}>
        <Button
          size={'large'}
          component={RouterLink}
          to={PATH_AUTH.login}
          onClick={() => {
            resetState()
          }}
          variant={'contained'}
          color={'primary'}
        >
          Acceder
        </Button>
      </Stack>
    </Stack>
  )
}
