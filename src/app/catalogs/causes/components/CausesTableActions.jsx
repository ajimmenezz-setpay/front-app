import { useState } from 'react'

import { Edit } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'

import { useChangeStatusCause } from '../hooks'
import { useCausesStore } from '../store'

import { IOSSwitch } from '@/shared/components/form'
import { CircularLoading } from '@/shared/components/loadings'

export function getCausesTableActions(table) {
  const { row } = table
  const { original: rowData } = row
  const { status } = rowData

  const [causeIdToggleStatus, setCauseIdToggleStatus] = useState(null)
  const { setOpenNewCause, setCause } = useCausesStore()
  const { mutate: toggleStatus, isLoading: isChangingCauseStatus } = useChangeStatusCause()

  const isChangingStatus = isChangingCauseStatus && causeIdToggleStatus === rowData?.id

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
          size="sm"
          color={!status ? 'error' : 'success'}
          checked={status || false}
          inputProps={{ 'aria-label': 'controlled' }}
          onChange={e => {}}
          onClick={e => {
            e.stopPropagation()
            setCauseIdToggleStatus(rowData?.id)
            toggleStatus(
              { ...rowData, changeStatus: !status },
              {
                onSuccess: () => {
                  setCauseIdToggleStatus(null)
                },
                onError: () => {
                  setCauseIdToggleStatus(null)
                }
              }
            )
          }}
        />
      )}
      {status && !isChangingStatus && (
        <IconButton
          size="small"
          color="primary"
          onClick={e => {
            e.stopPropagation()
            setCause(rowData)
            setOpenNewCause(true)
          }}
        >
          <Edit size="small" fontSize="16px" />
        </IconButton>
      )}
    </Box>
  )
}
