import { useState } from 'react'

import { Add } from '@mui/icons-material'
import { Box, Chip, Typography } from '@mui/material'

import CompaniesPopOverDetails from './CompaniesPopOverDetails'

export const UserCompaniesColumn = ({ row }) => {
  const [firstCompany, ...restCompanies] = row?.companies?.list || []
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
      <CompaniesPopOverDetails
        anchorEl={anchorEl}
        open={open}
        handlePopoverClose={handlePopoverClose}
        data={row?.companies?.list || []}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 1
        }}
      >
        {firstCompany ? (
          <Chip size="small" color={firstCompany?.avatar?.color || 'info'} label={firstCompany?.name} />
        ) : (
          <Typography variant="caption">Sin empresas</Typography>
        )}

        {restCompanies && restCompanies?.length > 0 && (
          <Chip
            aria-owns={open ? 'mouse-companies-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={event => {
              handlePopoverOpen(event)
            }}
            onMouseLeave={handlePopoverClose}
            variant="outlined"
            label={restCompanies?.length || 0}
            size="small"
            icon={<Add sx={{ width: 12, height: 12 }} />}
          />
        )}
      </Box>
    </>
  )
}
