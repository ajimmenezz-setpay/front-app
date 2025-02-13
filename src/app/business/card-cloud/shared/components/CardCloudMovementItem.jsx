import { useState } from 'react'

import PropTypes from 'prop-types'

import { FlagCircle, MoreVert } from '@mui/icons-material'
import {
  alpha,
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography
} from '@mui/material'

import { useCardCloudSharedStore } from '../store'

import { stringAvatar } from '@/theme/utils'

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 0,
  width: 1,
  justifyContent: 'start',
  display: 'flex',
  alignItems: 'center',
  transition: theme.transitions.create('all')
}))

const StyledMenu = styled(props => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300]
    })
  }
}))

export const CardCloudMovementItem = ({ movement, ...others }) => {
  const isSelected = false

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelectedRow = e => {
    handleClick(e)
  }

  return (
    <>
      <ListItem
        {...others}
        sx={{
          padding: 0,
          borderRadius: 1
        }}
        disablePadding
        secondaryAction={
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            size="small"
          >
            <MoreVert />
          </IconButton>
        }
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
            <Avatar title={movement?.description} {...stringAvatar(movement?.description || '')}></Avatar>
          </ListItemAvatar>
          <Stack
            flex={1}
            sx={{ mr: 2 }}
            flexDirection={'row'}
            alignItems={'center'}
            gap={2}
            justifyContent={'space-between'}
          >
            <Stack>
              <Typography variant="subtitle1" fontWeight={600} sx={{ textWrap: 'balance' }}>
                {movement?.description}
              </Typography>
              <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.secondary">
                {movement?.authCode ? `${movement?.authCode} - ${movement?.date?.time}` : movement?.date?.time}
              </Typography>
            </Stack>
            <Stack>
              <Typography variant="subtitle1" color={movement?.amount?.color || 'text.primary'} fontWeight={'bold'}>
                {movement?.amount?.format}
              </Typography>
            </Stack>
          </Stack>
        </RootStyle>
      </ListItem>
      <Divider />
      <MenuCard open={open} handleClose={handleClose} anchorEl={anchorEl} movement={movement} />
    </>
  )
}

function MenuCard({ open, handleClose, anchorEl, movement }) {
  const { setSelectedMovement, setOpenSupportTicket } = useCardCloudSharedStore()
  return (
    <StyledMenu
      id="demo-customized-menu"
      MenuListProps={{
        'aria-labelledby': 'demo-customized-button'
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <MenuItem
        onClick={() => {
          setSelectedMovement(movement)
          setOpenSupportTicket(true)
          handleClose()
        }}
        disableRipple
      >
        <FlagCircle sx={{ color: theme => theme.palette.error.main }} />
        Levantar Ticket
      </MenuItem>
    </StyledMenu>
  )
}

CardCloudMovementItem.propTypes = {
  movement: PropTypes.shape({
    amount: PropTypes.shape({
      color: PropTypes.string,
      format: PropTypes.any
    }),
    authCode: PropTypes.any,
    date: PropTypes.shape({
      time: PropTypes.any
    }),
    description: PropTypes.string
  })
}
