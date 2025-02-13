import { useState } from 'react'

import PropTypes from 'prop-types'

import { Box, Link, Typography } from '@mui/material'

import AccountPopOverDetails from './AccountPopOverDetails'

const AccountColumn = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <AccountPopOverDetails
        anchorEl={anchorEl}
        open={open}
        handlePopoverClose={handlePopoverClose}
        data={row?.account}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: 1
        }}
      >
        <Link
          color={'info.main'}
          sx={{ cursor: 'auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          underline="none"
          variant={'subtitle2'}
          component={Typography}
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={event => {
            handlePopoverOpen(event)
          }}
          onMouseLeave={handlePopoverClose}
        >
          {row?.account?.name}
        </Link>
      </Box>
    </>
  )
}

AccountColumn.propTypes = {
  row: PropTypes.shape({
    account: PropTypes.shape({
      name: PropTypes.any
    })
  })
}

export default AccountColumn
