import { Skeleton, Stack, useTheme } from '@mui/material'

export default function SkeletonCardItem({ isOpenSideBar }) {
  const theme = useTheme()
  const background = theme.palette.mode === 'dark' ? 'background.paper' : theme.palette.grey.A200
  return (
    <Stack spacing={1} direction="row" alignItems="center" sx={{ px: 3, py: 1.5 }}>
      <Skeleton sx={{ backgroundColor: background }} variant="circular" width={48} height={48} />
      {isOpenSideBar && (
        <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" sx={{ width: 0.5, height: 16, backgroundColor: background }} />
          <Skeleton variant="text" sx={{ width: 0.25, height: 12, backgroundColor: background }} />
        </Stack>
      )}
    </Stack>
  )
}
