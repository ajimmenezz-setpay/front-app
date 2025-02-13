import { Skeleton, Stack, useTheme, alpha } from '@mui/material'

export const AdminSpeiMovementSkeleton = () => {
  const theme = useTheme()
  const background = theme.palette.mode === 'dark' ? alpha(theme.palette.grey.A200, 0.2) : theme.palette.grey.A200
  return (
    <Stack spacing={1} direction="row" alignItems="center" sx={{ px: 3, py: 1.5 }}>
      <Skeleton sx={{ backgroundColor: background }} variant="circular" width={48} height={48} />
      <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" sx={{ width: 0.5, height: 16, backgroundColor: background }} />
        <Skeleton variant="text" sx={{ width: 0.25, height: 12, backgroundColor: background }} />
      </Stack>
    </Stack>
  )
}
