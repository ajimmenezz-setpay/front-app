import { useState } from 'react'

import { Box } from '@mui/material'

import { useToggleStockCardStatusOfCardCloud } from '../hooks'

import { IOSSwitch } from '@/shared/components/form'
import { CircularLoading } from '@/shared/components/loadings'

export const CardCloudStockCardsTableActions = ({ table }) => {
  const { row } = table
  const { original: rowData } = row
  const { status } = rowData

  const [idToggleStatus, setIdToggleStatus] = useState(null)
  const { mutate: changeStatusCard, isLoading: isChangingStatusCard } = useToggleStockCardStatusOfCardCloud()

  const handleChange = event => {
    changeStatusCard(
      { ...rowData, cardON: !status?.isActive},
      {
        onSuccess: () => {},
        onError: () => {}
      }
    )
  }

  const isChangingStatus = isChangingStatusCard && idToggleStatus === rowData?.id

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
            display: 'flex'
          }}
        />
      ) : (
        <IOSSwitch
          size="sm"
          color={!status?.isActive ? 'error' : 'success'}
          checked={status?.isActive || false}
          inputProps={{ 'aria-label': 'controlled' }}
          onChange={e => {}}
          onClick={e => {
            e.stopPropagation()
            setIdToggleStatus(rowData?.id)
            handleChange()
          }}
        />
      )}
    </Box>
  )
}
