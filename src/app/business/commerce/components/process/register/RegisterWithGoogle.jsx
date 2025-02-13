import { Google } from '@mui/icons-material'
import { Button, Divider, Stack, Typography } from '@mui/material'

function RegisterWithGoogle() {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Google sx={{ color: '#EA4335' }} width={24} height={24} />
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          O
        </Typography>
      </Divider>
    </>
  )
}

export default RegisterWithGoogle
