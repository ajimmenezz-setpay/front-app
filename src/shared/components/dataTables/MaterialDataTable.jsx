/* eslint-disable camelcase */
import PropTypes from 'prop-types'

import {
  MaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_TablePagination,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton
} from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'

const MaterialDataTable = ({ isError, textError = '', ...props }) => (
  <MaterialReactTable
    localization={MRT_Localization_ES}
    enableSortingRemoval={false}
    enableStickyHeader
    enableStickyFooter
    enableColumnResizing
    layoutMode={'grid'}
    muiTableHeadCellProps={({ column }) => ({
      sx: theme => ({
        color: column.getIsSorted() ? theme.palette.text.primary : theme.palette.text.secondary,
        backgroundColor: theme.palette.neutral
      })
    })}
    muiTableBodyRowProps={({ row }) => ({
      onClick: row.getToggleSelectedHandler(),
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
    })}
    defaultColumn={{
      maxSize: 400,
      minSize: 80,
      size: 180 // default size is usually 180
    }}
    muiTableBodyCellProps={{
      sx: theme => ({
        borderBottom: `dashed 1px ${theme.palette.divider}`,
        whiteSpace: 'pre-line'
      })
    }}
    muiBottomToolbarProps={{
      sx: theme => ({
        backgroundColor: 'inherit'
      })
    }}
    muiTopToolbarProps={{
      sx: theme => ({
        backgroundColor: 'inherit',
        '>div': {
          alignItems: 'center'
        }
      })
    }}
    muiToolbarAlertBannerProps={
      isError
        ? {
            color: 'error',
            children: textError,
            sx: {
              fontSize: 12
            }
          }
        : {
            sx: theme => ({
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              fontSize: 12
            })
          }
    }
    muiTablePaperProps={({ table }) => ({
      style: {
        zIndex: table.getState().isFullScreen ? 1500 : undefined
      },
      sx: theme => ({
        boxShadow: 'none',
        border: 0,
        borderColor: 'inherit',
        backgroundColor: table.getState().isFullScreen ? theme.palette.paper : 'transparent'
      })
    })}
    muiTablePaginationProps={{
      sx: theme => ({
        borderTop: `none`
      })
    }}
    displayColumnDefOptions={{
      'mrt-row-select': {
        size: 10
      }
    }}
    muiPaginationProps={{
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: true,
      variant: 'outlined'
    }}
    paginationDisplayMode={'default'}
    columnFilterDisplayMode={'popover'}
    {...props}
  />
)

MaterialDataTable.propTypes = {
  isError: PropTypes.bool,
  textError: PropTypes.string
}

const FullScreenAction = MRT_ToggleFullScreenButton
const ShowHideColumnsAction = MRT_ShowHideColumnsButton
const FiltersAction = MRT_ToggleFiltersButton
const SearchAction = MRT_ToggleGlobalFilterButton
const SearchGlobalTextField = MRT_GlobalFilterTextField
const TablePagination = MRT_TablePagination

export {
  FiltersAction,
  FullScreenAction,
  MaterialDataTable,
  SearchAction,
  SearchGlobalTextField,
  ShowHideColumnsAction,
  TablePagination
}
