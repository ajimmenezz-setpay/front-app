import PropTypes from 'prop-types'

import {
  Avatar,
  Box,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Stack,
  Typography,
  styled
} from '@mui/material'

import { useAdminDashboardSpeiStore } from '../../store'

import { Label } from '@/shared/components/form'
import { stringAvatar } from '@/theme/utils'

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 0,
  width: 1,
  justifyContent: 'start',
  display: 'flex',
  alignItems: 'center',
  transition: theme.transitions.create('all')
}))
export const AdminSpeiMovementItem = ({ movement, ...others }) => {
  const setOpenDetailsTransaction = useAdminDashboardSpeiStore(state => state.setOpenDetailsTransaction)
  const setTransaction = useAdminDashboardSpeiStore(state => state.setTransaction)
  const transaction = useAdminDashboardSpeiStore(state => state.transaction)

  const handleSelectedRow = e => {
    setOpenDetailsTransaction(true)
    setTransaction(movement)
  }

  const isSelected = transaction?.id === movement?.id

  const hasCommissions = movement?.commissions?.total?.number > 0
  return (
    <>
      <ListItem
        {...others}
        sx={{
          padding: 0,
          borderRadius: 1
        }}
        disablePadding
      >
        <RootStyle
          component={'div'}
          onClick={handleSelectedRow}
          sx={{
            ...(isSelected && {
              bgcolor: 'secondary.light',
              color: 'text.primary.contrastText'
            }),
            width: 1
          }}
        >
          <ListItemAvatar>
            <Avatar title={movement?.beneficiary?.name} {...stringAvatar(movement?.beneficiary?.name)}></Avatar>
          </ListItemAvatar>
          <Stack flex={1}>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
              <Stack>
                <Typography variant="subtitle1" fontWeight={600} sx={{ textWrap: 'balance' }}>
                  {movement?.movement}
                </Typography>
                <Stack flexDirection={'row'} gap={1} alignItems={'center'}>
                  <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.secondary">
                    {movement?.date?.time}
                  </Typography>
                  <Box>
                    <Label variant={'outlined'} color={movement?.status?.color}>
                      {movement?.status?.name}
                    </Label>
                  </Box>
                </Stack>
              </Stack>

              <Stack alignItems={'flex-end'}>
                <Typography variant="subtitle1" color={movement?.amount?.color || 'text.primary'} fontWeight={'bold'}>
                  {movement?.amount?.format}
                </Typography>
                {hasCommissions && (
                  <Label variant={'ghost'} color={'warning'}>
                    {movement?.commissions?.total?.format}
                  </Label>
                )}
              </Stack>
            </Stack>
          </Stack>
        </RootStyle>
      </ListItem>
      <Divider />
    </>
  )
}

AdminSpeiMovementItem.propTypes = {
  movement: PropTypes.shape({
    amount: PropTypes.shape({
      color: PropTypes.string,
      format: PropTypes.any
    }),
    beneficiary: PropTypes.shape({
      name: PropTypes.any
    }),
    commissions: PropTypes.shape({
      total: PropTypes.any
    }),
    date: PropTypes.shape({
      dateTime: PropTypes.any,
      time: PropTypes.any
    }),
    id: PropTypes.any,
    movement: PropTypes.any,
    status: PropTypes.shape({
      color: PropTypes.any,
      name: PropTypes.any
    })
  })
}
