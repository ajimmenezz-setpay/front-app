import { Box, Stack, Typography } from '@mui/material'

export default function BlockContent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ height: 10, textAlign: { xs: 'center', md: 'left' } }}
    >
      {/* <UploadIllustration sx={{ width: '50%' }} /> */}

      <Box sx={{ p: 3 }} display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
        <Typography gutterBottom variant="subtitle1" fontWeight={'bold'}>
          Arrastra ó Selecciona los archivos
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Arrastra los archivos aquí o haz clic para&nbsp;
          <Typography variant="body2" component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
            buscar
          </Typography>
          &nbsp;en tu equipo
        </Typography>
      </Box>
    </Stack>
  )
}
