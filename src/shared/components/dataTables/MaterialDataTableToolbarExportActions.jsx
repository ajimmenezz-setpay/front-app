import { memo, useRef, useState } from 'react'

import { Download, Refresh } from '@mui/icons-material'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  alpha,
  styled,
  useTheme
} from '@mui/material'
import { BsFiletypeCsv, BsFiletypePdf } from 'react-icons/bs'
import { toast } from 'react-toastify'

import { FullScreenAction, SearchAction, ShowHideColumnsAction } from './MaterialDataTable'

import { useExportMaterialTable } from '@/shared/hooks'
import { isFunction } from '@/shared/utils'

const StyledMenu = styled(props => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: 180,
    marginTop: theme.spacing(1),
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiPaper-root': {
      width: '100%'
    }
  }
}))

const MaterialDataTableToolbarExportActions = ({ table, columns, fileName, handleRefetch, pdfConfig }) => {
  const { exportToCSV, exportToPDF } = useExportMaterialTable(table, columns)

  const handleExportCSV = () => {
    try {
      exportToCSV(fileName)
    } catch (error) {
      toast.error('Error al exportar el CSV')
    }
  }
  const handleExportPDF = () => {
    try {
      exportToPDF(fileName, pdfConfig)
    } catch (error) {
      toast.error('Error al exportar el PDF')
      console.log(error)
    }
  }

  return (
    <Stack flexDirection={'row'} alignItems={'center'}>
      <SearchAction table={table} />
      <Tooltip arrow title="Actualizar">
        <IconButton onClick={handleRefetch}>
          <Refresh />
        </IconButton>
      </Tooltip>
      <ShowHideColumnsAction table={table} />
      <FullScreenAction table={table} />

      <ExportMenu handleExportCSV={handleExportCSV} handleExportPDF={handleExportPDF} />
    </Stack>
  )
}

export default memo(MaterialDataTableToolbarExportActions)

function ExportMenu({ handleExportPDF, handleExportCSV }) {
  const anchorRef = useRef(null)
  const [openActions, setOpenActions] = useState(false)

  const theme = useTheme()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClickPDF = event => {
    setAnchorEl(event.currentTarget)
    isFunction(handleExportPDF) && handleExportPDF()
    setOpenActions(false)
  }

  const handleClickCSV = event => {
    setAnchorEl(event.currentTarget)
    isFunction(handleClickCSV) && handleExportCSV()
    setAnchorEl(null)
    setOpenActions(false)
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        id="demo-customized-button"
        aria-controls={openActions ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openActions ? 'true' : undefined}
        onClick={() => setOpenActions(true)}
      >
        <Download />
      </IconButton>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        open={openActions}
        onClose={() => setOpenActions(false)}
        anchorEl={anchorRef.current}
      >
        <MenuItem ref={anchorEl} onClick={handleClickCSV} sx={{ typography: 'subtitle2' }}>
          <ListItemIcon>
            <BsFiletypeCsv fontSize={18} color={theme.palette.success.main} />
          </ListItemIcon>
          <ListItemText>Exportar CSV</ListItemText>
        </MenuItem>
        <MenuItem ref={anchorEl} onClick={handleClickPDF} sx={{ typography: 'subtitle2' }}>
          <ListItemIcon>
            <BsFiletypePdf fontSize={18} color={theme.palette.error.main} />
          </ListItemIcon>
          <ListItemText>Exportar PDF</ListItemText>
        </MenuItem>
      </StyledMenu>
    </>
  )
}
