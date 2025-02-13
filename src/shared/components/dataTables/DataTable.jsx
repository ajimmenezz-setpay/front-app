import PropTypes from 'prop-types'

import { Backdrop, Box, styled, ThemeProvider } from '@mui/material'
import { createTheme, useTheme } from '@mui/material/styles'
import MUIDataTable from 'mui-datatables'

import { CircularLoading } from '../loadings/CircularLoading'

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
  dark: PropTypes.bool,
  clickableCursorRow: PropTypes.bool
}

const StyledDataTable = styled(MUIDataTable)({
  '& div[class*="MUIDataTableFilterList-root"]:not(:empty)': {
    maxHeight: 'none',
    marginBottom: '16px',
    marginTop: '16px'
  },
  '& tr[class*="MUIDataTableBodyRow-hoverCursor"]': {
    cursor: 'pointer!important'
  }
})

export function DataTable({
  columns = [],
  data = [],
  options = {},
  dark = false,
  clickableCursorRow = false,
  isLoading = false,
  ...others
}) {
  const theme = useTheme()
  const getMuiTheme = () =>
    createTheme({
      ...theme,
      components: {
        ...theme.components,
        MUIDataTable: {
          styleOverrides: {
            root: {
              backgroundColor: `${dark ? theme.palette.background.default : theme.palette.background.paper}!important`
            }
          }
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              cursor: clickableCursorRow ? 'pointer' : 'default'
            }
          }
        },
        MuiTableFooter: {
          styleOverrides: {
            root: {
              borderTop: `solid 1px ${theme.palette.divider}`,
              '& .MuiToolbar-root': {
                // backgroundColor: 'white'
              }
            }
          }
        },
        MUIDataTableToolbarSelect: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.lighter
            }
          }
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderBottom: 'none',
              '&:first-of-type': {
                paddingLeft: theme.spacing(2)
              }
            },
            head: {
              color: theme.palette.text.primary,
              backgroundColor: `${
                theme.palette.mode === 'light' ? theme.palette.background.neutral : theme.palette.primary.dark
              }!important`
            },
            // stickyHeader: {
            //   backgroundColor: theme.palette.background.paper,
            //   backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`
            // },
            body: {
              '&:first-of-type': {
                paddingLeft: theme.spacing(2)
              },
              '&:last-of-type': {
                paddingRight: theme.spacing(2)
              }
            }
          }
        },
        MuiTablePagination: {
          styleOverrides: {
            root: {
              borderTop: `solid 1px ${theme.palette.divider}`
            },
            toolbar: {
              height: 64
            },
            select: {
              '&:focus': {
                borderRadius: theme.shape.borderRadius
              }
            },
            selectIcon: {
              width: 20,
              height: 20,
              marginTop: -4
            }
          }
        }
      }
    })

  const initOptions = {
    search: true,
    download: true,
    print: false,
    viewColumns: true,
    filter: true,
    filterType: 'dropdown',
    responsive: 'simple',
    tableBodyHeight: '',
    tableBodyMaxHeight: '600px',
    selectableRows: 'none',
    textLabels: {
      body: {
        noMatch: 'Lo siento, no hay un resultado que coincida con la búsqueda',
        toolTip: 'Ordenar',
        columnHeaderTooltip: column => `Ordenar por ${column.label}`
      },
      pagination: {
        next: 'Página Siguiente ',
        previous: 'Página Anterior',
        rowsPerPage: 'Datos por página:',
        displayRows: 'de'
      },
      toolbar: {
        search: 'Buscar',
        downloadCsv: 'Descargar CSV',
        print: 'Imprimir',
        viewColumns: 'Ver Columnas',
        filterTable: 'Filtrar Tabla'
      },
      filter: {
        all: 'Todos',
        title: 'FILTROS',
        reset: 'BORRAR'
      },
      viewColumns: {
        title: 'Ver Columnas',
        titleAria: 'Ver/Ocultar Columnas'
      },
      selectedRows: {
        text: 'fila(s) seleccionada',
        delete: 'Borrar',
        deleteAria: 'Borrar Filas Seleccionadas'
      }
    },
    onDownload: (buildHead, buildBody, columns, data) => `\uFEFF${buildHead(columns)}${buildBody(data)}`,
    ...options
  }

  return (
    <ThemeProvider theme={getMuiTheme}>
      <Box>
        <Backdrop
          open={isLoading}
          sx={{
            // color: '#fff',
            position: 'absolute',
            height: '100%',
            backgroundColor: theme => theme.palette.mode === 'light' && 'rgba(244, 247, 252, 0.72)',
            backdropFilter: 'blur(10px)',
            zIndex: theme => theme.zIndex.drawer - 1
          }}
        >
          <CircularLoading />
        </Backdrop>
        <StyledDataTable className="test" data={data} columns={columns} options={initOptions} {...others} />
      </Box>
    </ThemeProvider>
  )
}
