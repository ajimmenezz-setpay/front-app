import { Card, Skeleton, Stack } from '@mui/material'

export function StockCardSkeleton() {
  return (
    <Card
      sx={theme => ({
        color: theme.palette.common.white,
        display: 'flex',
        p: 3,
        flexDirection: 'column',
        justifyContent: 'space-between'
      })}
    >
      <Stack>
        <Skeleton variant="text" sx={{ width: 0.3 }} />
        <Skeleton variant="text" sx={{ width: 0.5 }} />
      </Stack>

      <Stack sx={{ py: 1.5 }}>
        <Skeleton variant="text" sx={{ width: 0.9, height: 40 }} />
      </Stack>

      <Stack direction={'row'} spacing={2}>
        <Stack spacing={0.5}>
          <Skeleton variant="text" sx={{ width: 100 }} />
          <Skeleton variant="text" sx={{ width: 40 }} />
        </Stack>

        <Stack spacing={0.5}>
          <Skeleton variant="text" sx={{ width: 100 }} />
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Skeleton variant="text" sx={{ width: 40 }} />
            <Skeleton variant="circular" sx={{ width: 16, height: 16 }} />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  )
}
