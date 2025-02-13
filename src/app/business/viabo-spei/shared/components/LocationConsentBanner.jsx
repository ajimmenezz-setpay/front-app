import { useMemo, useState } from 'react'

import { LocationOn } from '@mui/icons-material'
import { Box, Button, Snackbar, Typography, alpha } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { useUiSharedStore } from '@/shared/store'

const LocationConsentBanner = () => {
  const { isEnableLocation, setEnableLocation } = useUiSharedStore()
  const [openDialog, setOpenDialog] = useState(true)

  const open = useMemo(() => !isEnableLocation && openDialog, [isEnableLocation, openDialog])

  const handleAccept = () => {
    setEnableLocation(true)
  }

  const handleDecline = () => {
    setOpenDialog(false)
  }

  return (
    <>
      <Outlet />
      <Snackbar
        open={open}
        translate="yes"
        transitionDuration={1000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={theme => ({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 1.5
        })}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            borderRadius: 1.5,
            backgroundColor: alpha('#000000', 0.9),
            backdropFilter: `blur(10px)`,
            WebkitBackdropFilter: `blur(10px)`,
            padding: 2,
            gap: 2,
            boxShadow: '0 0 10px 5px rgba(76, 175, 80, 0.6)', // Borde inicial
            animation: 'ringPulse 3s infinite', // Animación infinita
            '@keyframes ringPulse': {
              '0%': {
                boxShadow: '0 0 10px 5px rgba(76, 175, 80, 0.6)' // Verde
              },
              '50%': {
                boxShadow: '0 0 10px 5px rgba(255, 193, 7, 0.6)' // Amarillo
              },
              '100%': {
                boxShadow: '0 0 10px 5px rgba(244, 67, 54, 0.6)' // Rojo
              }
            }
          }}
        >
          <Box color={'white'} component={'span'} alignSelf={'center'} alignContent={'center'}>
            <LocationOn />
          </Box>
          <Box>
            <Typography variant="overline" color={'white'}>
              El servicio de SPEI Cloud requiere acceso a la ubicación para poder realizar operaciones y mejorar la
              experiencia dentro del sistema.
            </Typography>
            <Typography variant="body2" fontWeight={'light'} color={'#cecece'} mt={1}>
              De lo contrario podría presentar algunos inconvenientes al realizar algunas operaciones.
            </Typography>
          </Box>
          <Box display={'flex'} flexDirection={{ xs: 'column', xl: 'row' }} gap={2}>
            <Button variant="contained" color="success" onClick={handleAccept}>
              Permitir
            </Button>
            <Button variant="contained" color="error" onClick={handleDecline}>
              Rechazar
            </Button>
          </Box>
        </Box>
      </Snackbar>
    </>
  )
}

export default LocationConsentBanner
