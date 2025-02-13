import { Box, useTheme } from '@mui/material'

export function MasterCardLogo({ sx, color }) {
  const theme = useTheme()
  const PRIMARY_LIGHT = theme.palette.text.disabled
  const PRIMARY_MAIN = theme.palette.text.secondary
  const PRIMARY_DARK = theme.palette.text.primary

  return (
    <Box sx={{ display: 'flex', width: 50, height: 50, alignItems: 'center', ...sx }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24">
        <g fill="none">
          <path fill={color ? PRIMARY_MAIN : '#f26122'} d="M12.569 3.27h10.21v16.68h-10.21z" />
          <path
            fill={color ? PRIMARY_DARK : '#ea1d25'}
            d="M13.669 11.61a10.58 10.58 0 0 1 4-8.34 10.61 10.61 0 1 0 0 16.68 10.58 10.58 0 0 1-4-8.34z"
          />
          <path
            fill={color ? PRIMARY_LIGHT : '#f69e1e'}
            d="M34.829 11.61a10.61 10.61 0 0 1-17.16 8.34c4.6-3.622 5.396-10.286 1.78-14.89a10.4 10.4 0 0 0-1.78-1.79 10.61 10.61 0 0 1 17.16 8.34z"
          />
        </g>
      </svg>
    </Box>
  )
}
