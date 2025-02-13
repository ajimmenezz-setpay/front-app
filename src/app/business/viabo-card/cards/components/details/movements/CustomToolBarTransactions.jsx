import { FlagCircle } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'

export function CustomToolBarTransactions({ handleReport }) {
  return (
    <Box
      sx={{
        marginRight: 3
      }}
    >
      <Tooltip title="Incidencia">
        <IconButton onClick={handleReport}>
          <FlagCircle sx={{ color: theme => theme.palette.error.main }} width={24} height={24} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
