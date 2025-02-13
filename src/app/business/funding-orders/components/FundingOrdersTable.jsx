import { Card } from '@mui/material'

import { getFundingOrderActions } from './list/FundingOrderActions'
import { FundingOrderColumns } from './list/FundingOrderColumns'

import { useFindFundingOrders } from '../hooks'

import { MaterialDataTable } from '@/shared/components/dataTables'

const FundingOrdersTable = () => {
  const { data, isError, isLoading, isFetching, error } = useFindFundingOrders()

  const columns = FundingOrderColumns

  return (
    <Card variant="outlined">
      <MaterialDataTable
        enableColumnPinning
        enableColumnFilterModes
        enableStickyHeader
        enableRowVirtualization
        enableFacetedValues
        enableRowActions
        enableRowSelection
        positionActionsColumn="last"
        enableDensityToggle={false}
        columns={columns}
        data={data || []}
        isError={isError}
        textError={error}
        selectAllMode={'all'}
        initialState={{
          density: 'compact',
          sorting: [
            {
              id: 'date',
              desc: true
            }
          ]
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching
        }}
        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'Acciones', // change header text
            maxSize: 80 // make actions column wider
          },
          'mrt-row-select': {
            maxSize: 10
          }
        }}
        muiTableContainerProps={{ sx: { maxHeight: { md: '350px', lg: '450px', xl: '700px' } } }}
        renderRowActionMenuItems={({ closeMenu, row }) => getFundingOrderActions(row, closeMenu)}
      />
    </Card>
  )
}

export default FundingOrdersTable
