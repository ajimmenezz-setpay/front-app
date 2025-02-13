import PropTypes from 'prop-types'

import { Edit } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'

import { useSpeiCompaniesStore } from '../store'

import { IOSSwitch } from '@/shared/components/form'
import { CircularLoading } from '@/shared/components/loadings'

export function ViaboSpeiCompaniesTableActions({ table, isChangingCauseStatus, causeIdToggleStatus, onChangeStatus }) {
  const { row } = table
  const { original: rowData } = row
  const { status } = rowData

  const isChangingStatus = isChangingCauseStatus && causeIdToggleStatus === rowData?.id
  const { setSpeiCompany, setOpenNewSpeiCompany } = useSpeiCompaniesStore()

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: '8px'
      }}
    >
      {isChangingStatus ? (
        <CircularLoading
          size={15}
          containerProps={{
            display: 'flex',
            ml: 1
          }}
        />
      ) : (
        <IOSSwitch
          size="md"
          color={!status ? 'error' : 'success'}
          checked={status || false}
          inputProps={{ 'aria-label': 'controlled' }}
          onClick={e => {
            e.stopPropagation()
            onChangeStatus(rowData)
          }}
        />
      )}
      {status && (
        <IconButton
          size="small"
          color="primary"
          onClick={e => {
            e.stopPropagation()
            setSpeiCompany(rowData)
            setOpenNewSpeiCompany(true)
          }}
        >
          <Edit size="small" fontSize="16px" />
        </IconButton>
      )}
    </Box>
  )
}

ViaboSpeiCompaniesTableActions.propTypes = {
  causeIdToggleStatus: PropTypes.any,
  isChangingCauseStatus: PropTypes.any,
  onChangeStatus: PropTypes.func,
  table: PropTypes.shape({
    row: PropTypes.shape({
      original: PropTypes.shape({
        id: PropTypes.any,
        status: PropTypes.bool
      })
    })
  })
}
