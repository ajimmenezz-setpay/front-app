import { useState } from 'react'

import { Avatar, Card, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

import { useAssignCardStore } from '@/app/management/stock-cards/store'
import { AssignCardTableToolbar } from '@/app/shared/components'
import { DataTable } from '@/shared/components/dataTables'
import { CarnetLogo, MasterCardLogo } from '@/shared/components/images'

export function StockCardTable({ isLoading, cards = [] }) {
  const isReadyToAssign = useAssignCardStore(state => state.isReadyToAssign)
  const setOpenAssignCards = useAssignCardStore(state => state.setOpen)
  const setCard = useAssignCardStore(state => state.setCard)
  const [selectedCard, setSelectedCard] = useState(null)
  const { enqueueSnackbar } = useSnackbar()

  const columns = [
    {
      name: 'cardNumberHidden',
      label: 'Tarjeta',
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const rowData = cards[dataIndex]
          return (
            <Typography variant="subtitle2" fontWeight="bold">
              {rowData?.cardNumberHidden}
            </Typography>
          )
        }
      }
    },
    {
      name: 'cardType',
      label: 'Tipo',
      options: {
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const row = cards[dataIndex]
          return (
            <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
              <Avatar
                sx={theme => ({
                  width: 45,
                  height: 45,
                  color: theme.palette.primary.contrastText,
                  backgroundColor: theme.palette.primary.light
                })}
              >
                {row?.cardType === 'Carnet' ? (
                  <CarnetLogo sx={{ width: 30 }} color={'white'} />
                ) : (
                  <MasterCardLogo sx={{ width: 30 }} />
                )}
              </Avatar>
              <Typography variant="subtitle2">{row?.cardType}</Typography>
            </Stack>
          )
        }
      }
    },
    {
      name: 'expiration',
      label: 'Vence',
      options: {
        filterType: 'textField'
      }
    },
    {
      name: 'register',
      label: 'Fecha',
      options: {
        filterType: 'textField',
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const row = cards[dataIndex]
          return (
            <Stack>
              <Typography variant="subtitle2">{row?.registerDate}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {row?.registerTime}
              </Typography>
            </Stack>
          )
        }
      }
    }
  ]

  const handleAssignCard = () => {
    if (isReadyToAssign) {
      setOpenAssignCards(true)
      setCard(selectedCard)
    } else {
      setOpenAssignCards(false)
      enqueueSnackbar(`Por el momento no se puede asignar la tarjeta. No hay comercios disponibles`, {
        variant: 'warning',
        autoHideDuration: 5000
      })
    }
  }

  return (
    <Card>
      <DataTable
        isLoading={isLoading}
        data={cards || []}
        columns={columns}
        options={{
          responsive: 'simple',
          rowHover: true,
          selectableRows: 'single',
          selectableRowsOnClick: true,
          selectToolbarPlacement: 'replace',
          sortOrder: {
            name: 'register',
            direction: 'desc'
          },
          downloadOptions: {
            filename: 'tarjetas_stock.csv',
            filterOptions: {
              useDisplayedColumnsOnly: false // it was true
            }
          },
          onRowSelectionChange: (currentRowsSelected, allRowsSelected, rowsSelected) => {
            const selectedCard = cards?.find((valor, index) => rowsSelected.includes(index))
            setSelectedCard(selectedCard)
          },
          customToolbarSelect: selectedRows => <AssignCardTableToolbar handleAssign={handleAssignCard} />
        }}
      />
    </Card>
  )
}
