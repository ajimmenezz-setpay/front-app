import { useEffect, useRef } from 'react'

import { ArrowBack } from '@mui/icons-material'
import { Box, Button, Stack } from '@mui/material'

import { CardCloudSubAccountMovementsTable } from '../components/movements/CardCloudSubAccountMovementsTable'
import { useCardCloudDashboardStore } from '../store'

const CardCloudDashboardMovements = () => {
  const setOpenMovements = useCardCloudDashboardStore(state => state.setOpenMovements)

  const ref = useRef(null)

  useEffect(() => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'instant' })
    }
  }, [])

  return (
    <Stack gap={3} ref={ref}>
      <Box>
        <Button
          variant="outlined"
          sx={{ color: 'text.primary' }}
          onClick={() => setOpenMovements(false)}
          startIcon={<ArrowBack />}
        >
          Regresar
        </Button>
      </Box>

      <CardCloudSubAccountMovementsTable />
    </Stack>
  )
}

export default CardCloudDashboardMovements
