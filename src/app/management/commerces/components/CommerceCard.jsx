import { memo } from 'react'

import { PendingTwoTone, Person, QueryBuilderTwoTone } from '@mui/icons-material'
import { Box, Card, Stack, Typography } from '@mui/material'
import { createAvatar } from '@theme/utils'
import { shallow } from 'zustand/shallow'

import { getColorStatusCommerceById } from '@/app/management/commerces/services'
import { useCommerce } from '@/app/management/commerces/store'
import { Avatar } from '@/shared/components/avatar'
import { Label } from '@/shared/components/form'

function CommerceCard({ commerce }) {
  const { commerce: selectedCommerce } = useCommerce(state => state, shallow)
  const { account, information, status } = commerce
  const selected = selectedCommerce?.id === commerce.id
  return (
    <Card
      sx={theme => ({
        backgroundColor: selected ? theme.palette.secondary.lighter : theme.palette.background.paper,
        color: selected
          ? theme.palette.primary[theme.palette.mode === 'light' ? 'dark' : 'light']
          : theme.palette.text.primary,
        '&:hover': {
          border: 2,
          borderColor: theme => theme.palette.primary.main
        }
      })}
    >
      <Box sx={{ p: 1, position: 'relative' }}>
        <Label
          variant={'filled'}
          color={getColorStatusCommerceById(status?.id)}
          sx={{
            right: 16,
            zIndex: 9,
            top: 16,
            bottom: 0,
            position: 'absolute',
            textTransform: 'capitalize'
          }}
        >
          {status?.name}
        </Label>
      </Box>
      <Stack spacing={2.5}>
        {information?.commercialName ? (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 3, pb: 2.5 }}>
            <Avatar
              src={information?.avatar !== '' ? information?.avatar : ''}
              alt={information?.commercialName}
              color={createAvatar(information?.commercialName).color}
            >
              {createAvatar(information?.commercialName).name}
            </Avatar>
            <div>
              <Typography variant="subtitle2">{information?.commercialName}</Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}>
                {information?.fiscalName}
              </Typography>
            </div>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 3, pb: 0, pt: 4 }}>
            <PendingTwoTone sx={{ width: 30, height: 30, color: 'info.main' }} />

            <div>
              <Typography variant="subtitle2">No Disponible</Typography>
              <Typography variant="body2" sx={{ color: 'text.info', mt: 0.5, display: 'block' }}>
                Se encuentra en el paso: {status?.step}
              </Typography>
            </div>
          </Stack>
        )}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent={'space-between'}
          spacing={3}
          sx={theme => ({
            backgroundColor: selected ? theme.palette.secondary.main : theme.palette.background.neutral,
            color: selected
              ? theme.palette.primary[theme.palette.mode === 'light' ? 'dark' : 'light']
              : theme.palette.text.primary,
            p: 3,
            pb: 2.5
          })}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Person sx={{ width: 16, height: 16 }} />
            <Typography variant="caption">{account?.name}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <QueryBuilderTwoTone sx={{ width: 16, height: 16 }} />
            <Typography variant="caption">{account?.register ? account?.register : '-'} </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  )
}

export default memo(CommerceCard)
