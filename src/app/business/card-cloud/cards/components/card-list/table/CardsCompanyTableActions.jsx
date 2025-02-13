import { useState } from 'react'

import { Visibility } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { useToggleCardStatusOfCardCloud } from '../../../hooks'
import { useCardsOfCardCloudStore } from '../../../store'

import { CARD_CLOUD_PATHS } from '@/app/business/card-cloud/shared/routes/card-cloud-paths'
import { useCardCloudSharedStore } from '@/app/business/card-cloud/shared/store'
import { IOSSwitch } from '@/shared/components/form'
import { CircularLoading } from '@/shared/components/loadings'

export const CardsCompanyTableActions = ({ table }) => {
  const { row } = table
  const { original: rowData } = row
  const { status } = rowData

  const [idToggleStatus, setIdToggleStatus] = useState(null)
  const { mutate: changeStatusCard, isLoading: isChangingStatusCard } = useToggleCardStatusOfCardCloud()
  const { selectedCompany } = useCardCloudSharedStore()
  const { setSelectedCard } = useCardsOfCardCloudStore()

  const navigate = useNavigate()

  const handleChange = event => {
    changeStatusCard(
      { ...rowData, cardON: !status?.isActive, subAccountId: selectedCompany?.subAccountId },
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

      <Tooltip title="Ver Detalles">
        <IconButton
          size="small"
          color="info"
          onClick={e => {
            e.stopPropagation()
            setSelectedCard(rowData)
            const url = CARD_CLOUD_PATHS.card(rowData?.id, selectedCompany?.subAccountId)
            navigate(url)
          }}
        >
          <Visibility size="small" fontSize="16px" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
