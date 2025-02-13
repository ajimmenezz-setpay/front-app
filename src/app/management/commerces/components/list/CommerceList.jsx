import { useEffect } from 'react'

import { Box, Card } from '@mui/material'

import { getCommerceActions } from './CommerceActions'

import { useCommercesColumns, useFindCommerceList } from '@/app/management/commerces/hooks'
import { MaterialDataTable } from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

export function CommerceList() {
  const { data: commerces, isLoading, isError, error, isFetching } = useFindCommerceList()

  const columns = useCommercesColumns()

  const table = useMaterialTable(isError, error, {
    columns,
    data: commerces || [],
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    enableDensityToggle: false,
    positionActionsColumn: 'last',
    selectAllMode: 'all',
    initialState: {
      density: 'compact',
      sorting: [
        {
          id: 'name',
          desc: false
        }
      ]
    },
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching
    },
    displayColumnDefOptions: {
      'mrt-row-select': {
        maxSize: 10
      },
      'mrt-row-actions': {
        header: 'Acciones',
        maxSize: 80
      }
    },
    muiTableContainerProps: { sx: { maxHeight: { md: '350px', lg: '450px', xl: '700px' } } },
    enableColumnResizing: true,
    layoutMode: 'grid',
    renderTopToolbarCustomActions: () => <Box></Box>,
    renderRowActionMenuItems: getCommerceActions
  })

  const responsizeColumnHiding = (minColumns = 1) => {
    const containerWidth = table.refs.tableContainerRef.current.offsetWidth
    const cellPadding =
      table.getState().density === 'spacious' ? 40 : table.getState().density === 'comfortable' ? 32 : 16
    const extraMargin = 20
    let totalColumnWidth = 0

    const columns = table.getAllColumns()
    for (let i = 0; i < columns.length; i++) {
      totalColumnWidth += columns[i].getSize() + cellPadding
      if (totalColumnWidth + extraMargin > containerWidth) {
        if (i > minColumns) {
          columns[i].toggleVisibility(false)
        }
      } else {
        columns[i].toggleVisibility(true)
      }
    }
  }

  useEffect(() => {
    responsizeColumnHiding(3)

    function handleResize() {
      responsizeColumnHiding(3)
    }
    window.addEventListener('resize', handleResize)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, table.getState().density])

  return (
    <Card>
      <MaterialDataTable table={table} />
    </Card>
  )
}
