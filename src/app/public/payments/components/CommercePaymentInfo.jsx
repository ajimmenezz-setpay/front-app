import { LocalPhoneOutlined, NearMeOutlined } from '@mui/icons-material'
import { Avatar, Box, Card, Stack, Typography } from '@mui/material'

import { usePublicPaymentStore } from '../store'

import { Logo } from '@/shared/components/images'

export const CommercePaymentInfo = () => {
  const { commerce } = usePublicPaymentStore(state => state)
  return (
    <Stack>
      <Card sx={{ width: 1, position: 'relative' }} variant='outlined' elevation={2}>
        <Box sx={{ backgroundColor: theme => theme.palette.info.main, height: 10 }} />
        <Stack flexDirection={'row'} gap={3} p={3}>
          <Stack>
            <Avatar
              src={commerce?.information?.logo}
              sx={theme => ({
                width: 110,
                height: 110,
                color: theme.palette.primary.contrastText,
                backgroundColor: theme.palette.grey[500]
              })}
            >
              <Logo sx={{ width: 50 }} />
            </Avatar>
          </Stack>
          <Stack flex={1} spacing={2}>
            <Typography variant="h6" fontWeight={'bold'}>
              {commerce?.information?.commercialName}
            </Typography>
            {commerce?.information?.phoneNumbers !== '' && (
              <Stack gap={1} flexDirection={'row'} flexWrap>
                <LocalPhoneOutlined />
                <Typography sx={{ wordBreak: 'break-word' }} variant="subtitle1">
                  {commerce?.information?.phoneNumbers}
                </Typography>
              </Stack>
            )}

            {commerce?.information?.postalAddress !== '' && (
              <Stack gap={1} flexDirection={'row'} flexWrap>
                <NearMeOutlined />
                <Typography sx={{ wordBreak: 'break-word' }} variant="subtitle1">
                  {commerce?.information?.postalAddress}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Card>
    </Stack>
  )
}
