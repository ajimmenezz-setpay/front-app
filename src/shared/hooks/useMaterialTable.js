/* eslint-disable camelcase */
import { useMaterialReactTable } from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'

export function useMaterialTable(isError, textError, others = {}) {
  const initialProps = {
    localization: MRT_Localization_ES,
    enableSortingRemoval: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableColumnResizing: true,
    layoutMode: 'grid',
    muiTableContainerProps: { sx: { maxHeight: { md: '350px', lg: '600px', xl: '900px' } } },
    muiTableHeadProps: {
      sx: theme => ({
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.neutral,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`
            : 'none',
        boxShadow: 'none',
        backdropFilter: `blur(10px)`,
        WebkitBackdropFilter: `blur(10px)`,
        zIndex: 1000
      })
    },
    muiTableHeadRowProps: {
      sx: theme => ({
        backgroundColor: 'inherit',
        boxShadow: 'none'
      })
    },
    muiTableHeadCellProps: ({ column }) => ({
      sx: theme => ({
        color: column.getIsSorted() ? theme.palette.text.primary : theme.palette.text.secondary,
        backgroundColor: 'inherit',
        boxShadow: 'none'
      })
    }),
    muiTableBodyRowProps: ({ row }) => ({
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
    }),
    defaultColumn: {
      maxSize: 400,
      minSize: 80,
      size: 180 // default size is usually 180
    },
    muiTableBodyCellProps: {
      sx: theme => ({
        borderBottom: `dashed 1px ${theme.palette.divider}`,
        whiteSpace: 'pre-line'
      })
    },
    muiBottomToolbarProps: {
      sx: theme => ({
        backgroundColor: 'inherit'
      })
    },
    muiTopToolbarProps: {
      sx: theme => ({
        backgroundColor: 'inherit',
        '>div': {
          alignItems: 'center'
        }
      })
    },
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: textError,
          sx: {
            fontSize: 12
          }
        }
      : {
          sx: theme => ({
            // backgroundColor: theme.palette.primary.light,
            // color: theme.palette.primary.contrastText,
            fontSize: 12
          })
        },
    muiTablePaperProps: ({ table }) => ({
      elevation: 0,
      style: {
        zIndex: table.getState().isFullScreen ? 1500 : undefined
      },
      sx: theme => ({
        // boxShadow: 'none',
        backgroundColor: table.getState().isFullScreen ? theme.palette.background.paper : 'transparent',
        borderColor: 'inherit',
        border: 0

        // borderRadius: 0
      })
    }),
    muiTablePaginationProps: {
      sx: theme => ({
        borderTop: `none`
      })
    },
    displayColumnDefOptions: {
      'mrt-row-select': {
        size: 10
      },
      'mrt-row-actions': {
        header: 'Acciones', // change header text
        size: 80 // make actions column wider
      }
    },
    muiPaginationProps: {
      rowsPerPageOptions: [50, 100, 200, 1000],
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: true,
      variant: 'outlined'
    },
    paginationDisplayMode: 'default',
    columnFilterDisplayMode: 'popover'
  }

  return useMaterialReactTable({
    ...initialProps,
    ...others,
    initialState: {
      density: 'compact',
      pagination: { pageSize: 50, pageIndex: 0 },
      ...others?.initialState
    }
  })
}
