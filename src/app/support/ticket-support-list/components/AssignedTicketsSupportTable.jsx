import { useEffect, useState } from 'react'

import { useAssignedTicketsTableColumns, useFindAssignedTicketsSupport } from '../hooks'
import { useTicketSupportListStore } from '../store'

import { MaterialDataTable } from '@/shared/components/dataTables'
import { useMaterialTable } from '@/shared/hooks'

export const AssignedTicketsSupportTable = () => {
  const { data: tickets, isLoading, isError, error, isFetching, refetch } = useFindAssignedTicketsSupport()

  const {
    setTotalSupportTicketsAssigned: setTotal,
    setFullScreenTableSupportList: setFullScreen,
    setSupportTicketDetails,
    setOpenTicketConversation
  } = useTicketSupportListStore()

  const columns = useAssignedTicketsTableColumns()

  const [rowSelection, setRowSelection] = useState({})

  const table = useMaterialTable(isError, error, {
    columns,
    data: tickets || [],
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableFacetedValues: true,
    enableDensityToggle: false,
    enableMultiRowSelection: false,
    initialState: {
      density: 'compact',
      sorting: [
        {
          id: 'date',
          desc: true
        }
      ]
    },
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      rowSelection
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Acciones',
        maxSize: 80
      }
    },
    muiTableContainerProps: { sx: { maxHeight: { md: '350px', lg: '450px', xl: '700px' } } },
    enableColumnResizing: true,
    layoutMode: 'grid',

    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        row.getToggleSelectedHandler()
        setSupportTicketDetails(row?.original)
        setOpenTicketConversation(true)
      },
      selected: rowSelection[row.id],
      sx: theme => ({
        cursor: 'pointer',
        backgroundColor: 'inherit',
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }
      })
    }),
    positionToolbarAlertBanner: 'none',
    onRowSelectionChange: setRowSelection
  })

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (tickets?.length) {
      setTotal(tickets?.length)
    } else {
      setTotal(0)
    }
  }, [tickets])

  useEffect(() => {
    setFullScreen(table.getState().isFullScreen)
  }, [table.getState().isFullScreen])

  return <MaterialDataTable table={table} />
}
