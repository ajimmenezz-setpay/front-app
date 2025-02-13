import { useEffect, useMemo, useState } from 'react'

import PropTypes from 'prop-types'

import { AssignmentIndRounded, FileDownload, ManageAccounts } from '@mui/icons-material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Box, Button, Card, IconButton, Link, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import { toast } from 'react-toastify'

import AssignedPopOverDetails from './AssignedPopOverDetails'

import { useToggleStatusCard } from '../../../cards/hooks'
import { useFindAllCommerceCards } from '../../hooks'
import { useAssignUserCard, useCommerceCards } from '../../store'

import { getOperationTypeByName } from '@/app/shared/services'
import {
  FullScreenAction,
  MaterialDataTable,
  SearchAction,
  ShowHideColumnsAction
} from '@/shared/components/dataTables'
import { IOSSwitch, Label } from '@/shared/components/form'
import { CarnetLogo, MasterCardLogo } from '@/shared/components/images'
import { CircularLoading } from '@/shared/components/loadings'
import { useMaterialTable } from '@/shared/hooks'
import { generateCSVFile } from '@/shared/utils'

export const CommerceCardsTable = ({ resetSelection, setResetSelection }) => {
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })
  const [rowSelection, setRowSelection] = useState({})

  const { setOpenUserInfo, setCardInfo } = useAssignUserCard(state => state)
  const setOpenAssign = useCommerceCards(state => state.setOpenAssign)
  const setSelectedCards = useCommerceCards(state => state.setAllCards)

  const theme = useTheme()

  const { data, isLoading, isFetching, isError, error, refetch } = useFindAllCommerceCards({
    columnFilters: columnFilters ?? [],
    globalFilter: globalFilter ?? '',
    pageIndex: pagination?.pageIndex ?? 0,
    pageSize: pagination?.pageSize ?? 10,
    sorting: sorting ?? []
  })

  const { mutate: changeStatusCard, isLoading: isChangingStatusCard } = useToggleStatusCard()

  const [anchorEl, setAnchorEl] = useState(null)
  const [hoverInfo, setHoverInfo] = useState(null)
  const [cardIdToggleStatus, setCardIdToggleStatus] = useState(null)

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
    setHoverInfo(null)
  }

  const open = Boolean(anchorEl)

  const columns = useMemo(
    () => [
      {
        id: 'cardNumber',
        accessorKey: 'cardNumber', // access nested data with dot notation
        header: 'Tarjeta',
        enableClickToCopy: true,
        enableHiding: false,
        size: 120,
        Cell: ({ cell, column, row }) => {
          const { original: dataRow } = row
          return (
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              {dataRow?.cardType === 'Carnet' ? (
                <CarnetLogo sx={{ width: 25, height: 25 }} />
              ) : (
                <MasterCardLogo sx={{ width: 25, height: 25 }} />
              )}
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                {dataRow?.cardNumber?.substr(dataRow?.cardNumber?.length - 4)}
              </Typography>
            </Stack>
          )
        }
      },
      {
        id: 'assigned',
        accessorFn: originalRow => originalRow?.assignUser?.fullName || null,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          if (renderedCellValue !== '-') {
            return (
              <Stack direction={'row'} spacing={2} alignItems={'center'}>
                <Link
                  color={'info.main'}
                  underline="none"
                  variant={'subtitle2'}
                  component={Typography}
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  onMouseEnter={event => {
                    handlePopoverOpen(event)
                    setHoverInfo(dataRow)
                  }}
                  onMouseLeave={handlePopoverClose}
                >
                  {renderedCellValue}
                </Link>
              </Stack>
            )
          }

          return renderedCellValue
        },
        header: 'Asignado',
        minSize: 150
      },
      {
        id: 'methods',
        accessorKey: 'methods', // access nested data with dot notation
        header: 'Métodos de Fondeo',
        minSize: 120,

        Cell: ({ cell, column, row }) => {
          const { original: rowData } = row
          const logos = []

          const paymentMethods = ['SPEI', 'PAYCASH']

          paymentMethods?.forEach(method => {
            const methodLogo = getOperationTypeByName(method)
            if (methodLogo) {
              logos.push({
                component: methodLogo?.component,
                width: method === 'PAYCASH' ? 50 : 30,
                height: method === 'PAYCASH' ? 50 : 30
              })
            }
          })
          return (
            <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
              {logos?.map(({ component: Logo, width, height }, index) => (
                <Logo key={index} sx={{ width, height }} />
              ))}
            </Stack>
          )
        }
      },
      {
        id: 'status',
        accessorFn: originalRow => originalRow?.cardStatus?.name || null,
        header: 'Estado',
        filterVariant: 'select',
        minSize: 100,
        Cell: ({ cell, column, row, renderedCellValue }) => {
          const { original: dataRow } = row

          if (!renderedCellValue) {
            return null
          }
          return (
            <Box sx={{ display: 'flex', pt: 1 }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={!dataRow?.cardStatus?.isActive ? 'error' : 'success'}
                sx={{ textTransform: 'capitalize' }}
              >
                {renderedCellValue}
              </Label>
            </Box>
          )
        }
      }
    ],
    []
  )

  const handleValidateCards = table => () => {
    const selectedCards = table.getSelectedRowModel().flatRows?.map(row => row.original) ?? []

    const someWithoutCVV = selectedCards.some(card => card?.cvv === '') && selectedCards?.length > 1
    const someAssigned = selectedCards.some(card => card?.assignUser?.id !== '')

    const allEmptyCVV = selectedCards.every(card => card?.cvv === '') && selectedCards?.length > 1

    if (allEmptyCVV) {
      toast.warn('Las tarjetas seleccionadas no tiene cvv , debe asignar una por una')
    } else if (someWithoutCVV) {
      toast.warn('Existe al menos una tarjeta seleccionada que no tiene cvv')
    } else if (someAssigned) {
      toast.warn('Existe al menos una tarjeta seleccionada que ya esta asignada')
    } else {
      setSelectedCards(selectedCards)
      setOpenAssign(true)
    }
  }

  const handleExportRows = table => () => {
    try {
      const filterData =
        table.getSortedRowModel().rows.map(row => columns?.map(c => row.getValue(c.accessorKey)) || []) ?? []
      generateCSVFile(columns?.map(c => c.header) || [], filterData, 'Stock del comercio')
    } catch {}
  }

  const table = useMaterialTable(isError, error, {
    columns,
    data: data?.data || [],
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    enableStickyHeader: true,
    enableRowVirtualization: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    positionActionsColumn: 'last',
    selectAllMode: 'all',
    rowCount: data?.meta?.total ?? 0,
    initialState: {
      density: 'compact',
      sorting: [
        {
          id: 'assigned',
          desc: true
        }
      ]
    },
    onRowSelectionChange: setRowSelection,
    state: {
      // columnFilters,
      // globalFilter,
      // pagination,
      // sorting,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      rowSelection: rowSelection ?? {}
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
    muiTableBodyRowProps: ({ row }) => ({
      sx: theme => ({
        backgroundColor: theme.palette.background.paper
        // '&.Mui-selected': {
        //   // backgroundColor: theme.palette.action.selected,
        //   // '&:hover': {
        //   //   backgroundColor: theme.palette.action.hover
        //   // }
        // }
      })
    }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Button
          onClick={handleValidateCards(table)}
          disabled={!table.getIsSomeRowsSelected()}
          startIcon={<AssignmentIndRounded width={24} height={24} />}
        >
          Asociar
        </Button>
      </Box>
    ),
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        <Tooltip arrow title="Actualizar">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <SearchAction table={table} />
        <Tooltip title="Descargar">
          <IconButton disabled={table.getPrePaginationRowModel().rows.length === 0} onClick={handleExportRows(table)}>
            <FileDownload />
          </IconButton>
        </Tooltip>

        <ShowHideColumnsAction table={table} />
        <FullScreenAction table={table} />
      </Box>
    ),
    renderRowActions: ({ row, table }) => {
      const { original: dataRow } = row
      const cardON = dataRow?.cardStatus?.isActive

      const isChangingStatus = isChangingStatusCard && cardIdToggleStatus === dataRow?.id

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
          {/* <IconButton size="small" color="primary" disabled={isLoading}>
                  <BsEye />
                </IconButton> */}
          {dataRow?.assignUser?.fullName !== '-' && (
            <IconButton
              size="small"
              color="primary"
              disabled={isLoading}
              onClick={() => {
                setCardInfo(dataRow)
                setOpenUserInfo(true)
              }}
            >
              <ManageAccounts />
            </IconButton>
          )}

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
              disabled={isLoading}
              size="sm"
              color={!cardON ? 'error' : 'success'}
              checked={cardON || false}
              inputProps={{ 'aria-label': 'controlled' }}
              onChange={() => {
                setCardIdToggleStatus(dataRow?.id)
                changeStatusCard(
                  { ...dataRow, cardON: !cardON },
                  {
                    onSuccess: () => {
                      setCardIdToggleStatus(null)
                    },
                    onError: () => {
                      setCardIdToggleStatus(null)
                    }
                  }
                )
              }}
            />
          )}
        </Box>
      )
    }
  })

  useEffect(() => {
    if (resetSelection) {
      table?.resetRowSelection()
      setResetSelection(false)
    }
  }, [resetSelection])

  return (
    <Card variant="outlined">
      <AssignedPopOverDetails
        anchorEl={anchorEl}
        open={open}
        handlePopoverClose={handlePopoverClose}
        data={hoverInfo}
      />
      <MaterialDataTable table={table} />
    </Card>
  )
}

CommerceCardsTable.propTypes = {
  resetSelection: PropTypes.any,
  setResetSelection: PropTypes.func
}
